
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { config } from "./config"
import { exec } from "child_process"
import expressWs from "express-ws"
import { EventEmitter } from "events"
import { argv } from "process"

const app = express()
app.use(bodyParser.json())
const appws = expressWs(app).app

export interface State {
    channels: undefined | Array<Array<{
        mute_state: number,
        username: string,
        speaking: boolean,
        streaming: boolean,
    }>>,
    self_deaf: boolean,
    self_muted: boolean,
    self_name: string,
    no_user_info: boolean,
}

var state: State = { channels: undefined, self_deaf: false, self_muted: false, no_user_info: true, self_name: "" }

var updateEmitter = new EventEmitter();

export function getBar(): string {
    if (!state.channels) return "Cant get info"
    var bar = ""

    if (config.showSelfStatus) {
        bar += config.selfStatusLabel + config.colorReset
        bar += state.self_muted ? `${config.flagColor}M${config.colorReset}` : " "
        bar += state.self_deaf ? `${config.flagColor}D${config.colorReset}` : " "
        bar += config.colorReset + config.modSeperator + config.colorReset
    }

    if (config.showUsers) {
        if (state.no_user_info) bar += config.errorColor + "No user info" + config.colorReset
        var chs_filtered = state.channels.filter(ch => (ch.length > 0))

        bar += chs_filtered.map(ch => {
            if (!ch.find(u => (u.username == state.self_name || config.alternateNicknames?.includes(state.self_name))) && config.onlyShowCurrentChannel) return "";
            return ch.map(u => {
                var color = config.defaultColor;
                if (u.speaking) color = config.speakingColor;
                if (u.mute_state > 0) color = config.mutedColor;
                if (u.mute_state > 1) color = config.deafColor;
                if (u.streaming) color += config.streamingColor;

                var flags = config.showFlags ? (" "
                    + (u.speaking ? `${config.flagColor}S${config.colorReset}` : " ")
                    + ((u.mute_state > 0) ? `${config.flagColor}M${config.colorReset}` : " ")
                    + ((u.mute_state > 1) ? `${config.flagColor}D${config.colorReset}` : " ")
                    + ((u.streaming) ? `${config.flagColor}V${config.colorReset}` : " ")
                ) : ""
                return `${color}${u.username}${config.colorReset}${flags}`
            }).join(config.userSeperator)
        }).join(config.onlyShowCurrentChannel ? "" : config.channelSeperator)
    }
    return bar
}

export function updateImmediate() {
    var any_speaking = false
    for (const ch of state?.channels || []) {
        for (const u of ch) {
            if (u.speaking) any_speaking = true
        }
    }
    if (speaking_last != any_speaking) {
        if (any_speaking) {
            exec(config.speakStartCommand)
        } else {
            exec(config.speakStopCommand)
        }
    }
    speaking_last = any_speaking
    updateEmitter.emit("update")

    if (argv.includes("--log")) {
        console.log(getBar())
    }
}

var speaking_last = false


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
    state = req.body;
    res.send("OK")
    updateImmediate()

})

appws.ws("/ws-update", (ws, req) => {
    console.log("WS!!");
    ws.onmessage = (ev) => {
        state = JSON.parse(ev.data.toString())
        updateImmediate()
    }
})


app.listen(8123, "127.0.0.1", () => {
    console.log("Server running!");
    //(new WebSocket("asdasd"))

})