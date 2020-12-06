
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { config } from "./config"
import expressWs from "express-ws"
import { EventEmitter } from "events"
import { argv } from "process"

const app = express()
app.use(bodyParser.json())
const appws = expressWs(app).app

export interface UserState {
    mute: boolean,
    deaf: boolean,
    username: string,
    speaking: boolean,
    streaming: boolean,
}

export interface State {
    channels: undefined | {
        [key: string]: Array<UserState>
    },
    self_deaf: boolean,
    self_muted: boolean,
    self_name: string,
    no_user_info: boolean,
}

var state: State = { channels: undefined, self_deaf: false, self_muted: false, no_user_info: true, self_name: "" }
var state_last: State = { channels: undefined, self_deaf: false, self_muted: false, no_user_info: true, self_name: "" }


var updateEmitter = new EventEmitter();

export function isSelfUsername(name: string): boolean {
    return name == state.self_name || config.alternateNicknames?.includes(name)
}

export function getBar(): string {
    if (!state.channels) return "Cant get info"
    var bar = ""

    if (config.showSelfStatus) {
        bar += config.selfStatusLabel + config.colorReset
        bar += state.self_muted ? `${config.flagColor}${config.muteFlag}${config.colorReset}` : " "
        bar += state.self_deaf ? `${config.flagColor}${config.deafFlag}${config.colorReset}` : " "
        bar += config.colorReset + config.modSeperator + config.colorReset
    }

    if (config.showUsers) {
        if (state.no_user_info) bar += config.errorColor + "No user info" + config.colorReset
        var ch_format_all = []
        for (const chname in state.channels) {
            if (!state.channels.hasOwnProperty(chname)) continue
            const ch = state.channels[chname];
            if (ch.length < 1 && config.skipEmptyChannels) continue
            if (!ch.find(u => isSelfUsername(u.username)) && config.onlyShowCurrentChannel) continue;
            var before_ch = ""
            if (config.showChannelName) before_ch = `${config.channelNameColor}${chname}: ${config.colorReset}`
            ch_format_all.push(before_ch + ch.map(u => {
                var color = config.defaultColor;
                if (u.speaking) color = config.speakingColor;
                if (u.mute) color = config.mutedColor;
                if (u.deaf) color = config.deafColor;
                if (u.streaming) color += config.streamingColor;

                var flags = config.showFlags ? (" "
                    + (u.speaking ? `${config.flagColor}${config.speakingFlag}${config.colorReset}` : config.noFlag)
                    + ((u.mute) ? `${config.flagColor}${config.muteFlag}${config.colorReset}` : config.noFlag)
                    + ((u.deaf) ? `${config.flagColor}${config.deafFlag}${config.colorReset}` : config.noFlag)
                    + ((u.streaming) ? `${config.flagColor}${config.videoFlag}${config.colorReset}` : config.noFlag)
                ) : ""
                return `${color}${u.username}${config.colorReset}${flags}`
            }).join(config.userSeperator))
        }
        bar += ch_format_all.join(config.onlyShowCurrentChannel ? "" : config.channelSeperator)
    }

    return bar
}
var any_speaking_last = false
export function updateImmediate() {
    var any_speaking = false
    for (const chname in state.channels) {
        if (state.channels.hasOwnProperty(chname)) {
            const ch_new = state.channels[chname];
            if (!state_last.channels) continue
            const ch_old = state_last.channels[chname]
            if (!ch_old) continue

            var users_joined = ch_new.filter(u => !ch_old.map(q => q.username).includes(u.username))
            var users_left = ch_old.filter(u => !ch_new.map(q => q.username).includes(u.username))
            users_joined.forEach(u => config.onUserJoinChannel(u, state, state_last))
            users_left.forEach(u => config.onUserLeftChannel(u, state, state_last))

            var ch_zip = ch_new.map(u =>
                [ch_old.find(uf => uf.username == u.username) || {
                    deaf: false,
                    mute: false,
                    speaking: false,
                    streaming: false,
                    username: "[JUST JOINED]"
                }, u]
            )
            ch_zip.filter(([o, n]) => !o.speaking && n.speaking).forEach(u => config.onStartSpeaking(u[0], state, state_last))
            ch_zip.filter(([o, n]) => o.speaking && !n.speaking).forEach(u => config.onStopSpeaking(u[0], state, state_last))
            ch_zip.filter(([o, n]) => !o.mute && n.mute).forEach(u => config.onStartMute(u[0], state, state_last))
            ch_zip.filter(([o, n]) => o.mute && !n.mute).forEach(u => config.onStopMute(u[0], state, state_last))
            ch_zip.filter(([o, n]) => !o.deaf && n.deaf).forEach(u => config.onStartDeaf(u[0], state, state_last))
            ch_zip.filter(([o, n]) => o.deaf && !n.deaf).forEach(u => config.onStopDeaf(u[0], state, state_last))
            ch_zip.filter(([o, n]) => !o.streaming && n.streaming).forEach(u => config.onStartVideo(u[0], state, state_last))
            ch_zip.filter(([o, n]) => o.streaming && !n.streaming).forEach(u => config.onStopVideo(u[0], state, state_last))
            if (ch_new.find(u => u.speaking)) any_speaking = true
        }
    }
    if (any_speaking_last && !any_speaking) config.onStopSpeakingAny(state,state_last)
    if (!any_speaking_last && any_speaking) config.onStartSpeakingAny(state,state_last)
    any_speaking_last = any_speaking

    updateEmitter.emit("update")

    if (argv.includes("--log")) {
        console.log(getBar())
    }
}



app.use(cors())

app.get("/status", (req, res) => {
    res.send(getBar())
})

appws.ws("/ws-status", (ws, req) => {
    const wsu = () => {
        if (ws.readyState) ws.send(getBar())
    }
    updateEmitter.on("update", wsu)
    ws.onclose = () => updateEmitter.off("update", wsu)
})

app.options("/update")
app.post("/update", (req, res) => {
    state_last = state
    state = req.body;
    res.send("OK")
    updateImmediate()

})

appws.ws("/ws-update", (ws, req) => {
    console.log("WS!!");
    ws.onmessage = (ev) => {
        state_last = state
        state = JSON.parse(ev.data.toString())
        updateImmediate()
    }
})


app.listen(8123, "127.0.0.1", () => {
    console.log("Server running!");
    //(new WebSocket("asdasd"))

})