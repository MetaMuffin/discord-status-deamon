console.log('%c Muffins Mod Loaded!', 'background: #000000; color: #FF0000; font-size: 3rem');
try {
    setInterval(() => {
        var root = document.getElementById("app-mount")
        var self_bottom_bar = root.children[3].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[1].children[1].children[2]
        var self_muted = self_bottom_bar.children[0].getAttribute("aria-checked") == "true"
        var self_deaf = self_bottom_bar.children[0].getAttribute("aria-checked") == "true"
        var users = []
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
                    for (const user_e of ch_e.children[1].children) {
                        var user_c = user_e.children[0].children[0]
                        var username = user_c.children[1].textContent
                        
                        var speaking = false
                        user_c.children[0].classList.forEach((class_name) => {
                            if (class_name.startsWith("avatarSpeaking")) speaking = true
                        })
                        
                        var icons_c = user_c.children[2]
                        var mute_state = (icons_c) ? icons_c.children.length : 0
                        var streaming = false
    
                        if (icons_c) for (const e of icons_c.children) { 
                            if (e.children[0].getAttribute("aria-label") == "Video") streaming = true
                            if (e.children[0].textContent.startsWith("Live")) straming = true
                        }
                        if (streaming) mute_state -= 1;
                        
                        var user_data = {
                            username,
                            speaking: speaking,
                            mute_state,
                            streaming,
                        }
                        users.push(user_data)
                    }
                } 
            }
        }



        fetch("http://127.0.0.1:8123/update", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                users,
                self_deaf,
                self_muted,
                no_user_info,
            })
        });
        
    }, 1000)
} catch (e) {
    console.log("ERROROROOR");
    console.log(e);
}


