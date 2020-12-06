import { State } from ".";
import { Config } from "./config-types";

// Configuration for polybar color codes.
export const config: Config = {

    colorReset: "%{F-}%{B-}%{U-}",
    errorColor: "%{F#F00}%{B#000}",

    showUsers: true,
    // This will only work if you dont change your nickname on the server or add it to the list of your nicknames. If somebody else has your name it will also show the users in his channel.
    onlyShowCurrentChannel: false, 
    alternateNicknames: [],
    
    defaultColor: "%{F#409}",
    deafColor: "%{B#666}%{F#FFF}",
    mutedColor: "%{B#333}%{F#FFF}",
    streamingColor: "%{U#33F}",
    speakingColor: "%{B#000}%{F#0F0}",
    
    modSeperator: "  || ",
    channelSeperator: " || ",
    userSeperator: "| ",
    
    showChannelName: true,
    channelNameColor: "%{F#004}",

    deafFlag: "D",
    muteFlag: "M",
    speakingFlag: "S",
    videoFlag: "V",

    showFlags: true,
    flagColor: "%{B#333}%{F#FFF}",

    showSelfStatus: true,
    selfStatusLabel: "%{U#409}ME: ",

    skipEmptyChannels: true,

    onUserJoinChannel: () => { },
    onUserLeftChannel: () => { },
    statePreprocess: () => { },
    onStartSpeaking: () => { },
    onStopSpeaking: () => { },
    onStartMute: () => { },
    onStopMute: () => { },
    onStartDeaf: () => { },
    onStopDeaf: () => { },
    onStartVideo: () => { },
    onStopVideo: () => { },
    onStartSpeakingAny: () => { },
    onStopSpeakingAny: () => { },
}
