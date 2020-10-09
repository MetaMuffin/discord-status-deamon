// Configuration for polybar color codes.
export const config = {
    colorReset: "%{F-}%{B-}%{U-}",
    errorColor: "%{F#F00}",
    modSeperator: "  || ",

    showUsers: true,
    onlyShowCurrentChannel: true, // This will only work if you dont change your nickname on the server. If somebody else has your name it will also show the users in his channel.
    defaultColor: "%{F#FFF}",
    deafColor: "%{F#FFF}",
    mutedColor: "%{F#F00}",
    streamingColor: "%{}",
    speakingColor: "%{F#0F0}",
    channelSeperator: " || ",
    userSeperator: "| ",

    showFlags: false,
    flagColor: "%{B#333}%{F#F00}",

    showSelfStatus: true,
    nickname: "Marc",
    selfStatusLabel: "ME: ",
};
