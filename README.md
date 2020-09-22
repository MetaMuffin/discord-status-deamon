# discord-status-deamon

A daemon to provide status about information of users in discord channels and more.

The daemon is a nodejs-server where a patched discord version can connect and update the stored information. The formated status can be dowloaded via http (i.e. curl)

Note: The daemon only provides information about the server that is currently selected in the discord ui as it reads from the html source.

## Installation

1. Setting up the server
    - Clone this repo somewhere.
    - Make sure you have installed node.js >= 10
    - Run `npm i` to install dependencies
    - Run `npm run start` to start the server
    - Optionally you can setup something that automatically runs this command when you log in.
1. Patch your Discord client
    - Find the file `~/.config/discord/0.<version here>/modules/discord_voice/index.js`
    - Insert a require statement for the patch before the first line to `mod.js` in the repo
        - This should look something like: `require("../../../../../path/to/mod");` (do not append the `js` file extension)
    - Reload discord. (Probably `Ctrl+R`)
    - You can check if the injection worked if you see something in the discord console (Open with `Ctrl+Shift+I`)
1. Integrate this into your bar or anywhere you like. (see below)
    - Use `curl -sL http://127.0.0.1:8123/status` to get the status
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

## Todo

- A automatic way of patching discord
