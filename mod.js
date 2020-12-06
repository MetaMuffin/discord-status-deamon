const { connect } = require("http2");

console.log('%c Discord Status Deamon injection worked!', 'background: #000000; color: #FF0000; font-size: 3rem');
console.log('%c https://github.com/MetaMuffin/discord-status-deamon', 'background: #000000; color: #00FF00; font-size: 1rem');

try {
    // PATCH CONFIG
    var useWs = true
    var interval = useWs ? 300 : 1000

    var ws;

    const connect = () => {
        ws = new WebSocket("ws://127.0.0.1:8123/ws-update")
        ws.onclose = () => {
            setTimeout(connect, 1000)
        }
    }
    if (useWs) connect()

    const post = (data) => {
        if (useWs && ws.OPEN) {
            ws.send(JSON.stringify(data))
        } else {
            fetch("http://127.0.0.1:8123/update", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
        }

    }
    // Very stupid code that breaks with every version of discord, good luck.
    setInterval(() => {
        var root = document.getElementById("app-mount")
        var self_bottom;
        try {
            self_bottom = root.children[3].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[1].children[1]
        } catch(e) {
            self_bottom = root.children[3].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[2].children[1]
        }
        window.blub = self_bottom

        var self_bottom_bar = self_bottom.children[2]
        var self_muted = self_bottom_bar.children[0].getAttribute("aria-checked") == "true"
        var self_deaf = self_bottom_bar.children[1].getAttribute("aria-checked") == "true"
        var self_name = self_bottom.children[1].children[0].children[0].textContent
        var channels = {}
        var no_user_info = false

        try {
            var ch_list = root.children[3].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0]
        } catch (e) {
            no_user_info = true;
        }
        if (!no_user_info) {
            for (const ch_e of ch_list.children) {
                if (!ch_e.children) continue
                if (ch_e.children[1]) {
                    var ch_name = ch_e.children[0].children[0].children[0].children[0].children[1].textContent
                    var channel_users = []
                    var users = []
                    for (const user_e of ch_e.children[1].children) {
                        var user_c = user_e.children[0].children[0]
                        var username = user_c.children[1].textContent

                        var speaking = false
                        user_c.children[0].classList.forEach((class_name) => {
                            if (class_name.startsWith("avatarSpeaking")) speaking = true
                        })

                        var icons_c = user_c.children[2]
                        var streaming = false

                        var mute = false
                        var deaf = false;
                        if (icons_c) for (const e of icons_c.children) {
                            if (e.getAttribute("aria-label") == "Video") streaming = true
                            if (e.getAttribute("aria-label") == "Muted") mute = true
                            if (e.getAttribute("aria-label") == "Deafened") deaf = true
                            if (e.children[0].textContent.startsWith("Live")) straming = true
                        }

                        var user_data = {
                            username,
                            speaking,
                            mute,
                            deaf,
                            streaming,
                        }
                        channel_users.push(user_data)
                    }
                    channels[ch_name] = channel_users
                }
            }
        }
        post({
            channels,
            self_deaf,
            self_muted,
            no_user_info,
            self_name
        })
    }, interval)
} catch (e) {
    console.log("ERROROROOR");
    console.log(e);
}


