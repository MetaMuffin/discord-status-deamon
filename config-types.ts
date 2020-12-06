import { State, UserState } from ".";

// Configuration for polybar color codes.
export interface Config {
    
    colorReset: string,
    errorColor: string,
    modSeperator: string,
    
    showUsers: boolean,
    onlyShowCurrentChannel: boolean,
    alternateNicknames: string[],
    defaultColor: string,
    deafColor: string,
    mutedColor: string,
    streamingColor: string,
    speakingColor: string,
    channelSeperator: string,
    userSeperator: string,
    showChannelName: boolean,
    channelNameColor: string

    showFlags: boolean,
    flagColor: string,
    
    noFlag: string,
    deafFlag: string,
    muteFlag: string,
    speakingFlag: string,
    videoFlag: string,

    showSelfStatus: boolean,
    selfStatusLabel: string,

    skipEmptyChannels: boolean
    unsafeNames: boolean,

    statePreprocess: (state: State) => any,

    onUserLeftChannel: (user: UserState, state: State, state_last: State) => any,
    onUserJoinChannel: (user: UserState, state: State, state_last: State) => any,
    onStartSpeaking: (user: UserState, state: State, state_last: State) => any,
    onStopSpeaking: (user: UserState, state: State, state_last: State) => any,
    onStartMute: (user: UserState, state: State, state_last: State) => any,
    onStopMute: (user: UserState, state: State, state_last: State) => any,
    onStartDeaf: (user: UserState, state: State, state_last: State) => any,
    onStopDeaf: (user: UserState, state: State, state_last: State) => any,
    onStartVideo: (user: UserState, state: State, state_last: State) => any,
    onStopVideo: (user: UserState, state: State, state_last: State) => any,
    onStartSpeakingAny: (state: State, state_last: State) => any,
    onStopSpeakingAny: (state: State, state_last: State) => any,
}
