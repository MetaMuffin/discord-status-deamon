# discord-status-deamon

A daemon to provide status about information of users in discord channels and more.

The daemon is a nodejs-server where a patched discord version can connect and update the stored information. The formated status can be dowloaded via http (i.e. curl) or websockets

Note: The daemon only provides information about the server that is currently selected in the discord ui as it reads from the html source.

## Installation

1. Setting up the server
    - Clone this repo somewhere.
    - Make sure you have installed node.js >= 10
    - Run `npm i` to install dependencies
    - Run `npm run start` to start the server
    - Optionally you can setup something that automatically runs this command when you log in.
1. Initialise the confiuration
    - Copy `config-default.ts` to `config.ts` or run `init-config.sh`
1. Patch your Discord client
    - Use the script:
        - Run `patch.sh` with optional argument `canary` to patch discord-canary instead of discord. (This only works on unix-like systems and is still experimental)
    - Do it manually:
        - Find the file `~/.config/discord/0.<version here>/modules/discord_voice/index.js`
        - Insert a require statement for the patch before the first line to `mod.js` in the repo
            - This should look something like: `require("../../../../../path/to/mod");` (do not append the `js` file extension)
    - Reload discord. (Probably `Ctrl+R`)
    - You can check if the injection worked if you see something in the discord console (Open with `Ctrl+Shift+I`)
1. Integrate this into your bar or anywhere you like. (see below)
    - Use `curl -sL http://127.0.0.1:8123/status` to get the status
    - OR you can use the incoming messages from the websocket on `ws://127.0.0.1:8123/ws-status`
    - OR you can use the output of of the server when it is run with `--log`
1. Configure stuff in `config.ts`

## Polybar module

A sample polybar module

```ini
[module/discord]
type = custom/script
exec = "curl -sL http://127.0.0.1:8123/status"
interval = 1
label = "Discord: %output%"
label-foreground = #440099
```

Polybar module for Websocket updates

```ini
[module/discord-ws]
type = custom/script
exec = "websocat ws://127.0.0.1:8123/ws-status"
label = "D: %output%"
label-foreground = #440099
tail = true
```

Polybar to use the output of the server

```ini
[module/discord-stdout]
type = custom/script
exec = "cd /path/to/discord-statusd; ts-node index.ts"
label = "D: %output%"
label-foreground = #440099
tail = true
```

## Todo

- A automatic way of patching discord

## Licence, etc

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

Additionally it also violates the discord TOS if used.
