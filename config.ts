// Configuration for polybar color codes.
export const config = {
    
    colorReset: "%{F-}%{B-}%{U-}",
    errorColor: "%{F#F00}%{B#000}",
    modSeperator: "  || ",
    
    showUsers: true,
    onlyShowCurrentChannel: false, // This will only work if you dont change your nickname on the server. If somebody else has your name it will also show the users in his channel.
    defaultColor: "%{F#409}",
    deafColor: "%{B#666}%{F#FFF}",
    mutedColor: "%{B#333}%{F#FFF}",
    streamingColor: "%{U#33F}",
    speakingColor: "%{B#000}%{F#0F0}",
    channelSeperator: " || ",
    userSeperator: "| ",
    
    showFlags: true,
    flagColor: "%{B#333}%{F#FFF}",

    showSelfStatus: true,
    selfStatusLabel: "%{U#409}ME: ",

    speakStartCommand: "rhythmbox-client --set-volume $(cat /tmp/dvol-start)",
    speakStopCommand: "rhythmbox-client --set-volume $(cat /tmp/dvol-stop)",

}
