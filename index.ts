
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { config } from "./config"

const app = express()
app.use(bodyParser.json())

export interface State {
    users: undefined | Array<{
        mute_state: number,
        username: string,
        speaking: boolean,
        streaming: boolean,
    }>
}

var state:State = {users:undefined}

app.get("/status",(req,res) => {
    var bar = ""
    if (!state.users) return res.send("Cant get info")
    
    bar += state.users.map(u => {
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
    }).join(", ")
    
    res.send(bar)
})

app.options("/update", cors())
app.post("/update", cors(), (req,res) => {
    state = req.body;
    res.send("OK")
})


app.listen(8123,"127.0.0.1",() => {
    console.log("Server running!");
})