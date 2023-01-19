const config = {
    "spaceArg": [
        ["siteTitle","BlogBooks Community"], ["discord.inviteURL", "https://discord.gg/Fk8FJt7Dsb"], [""]
    ]
}

function escape(string) {
    if(typeof string !== 'string') {
        return string;
    }
    return string.replace(/[&'`"<>]/g, function(match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}

function request() {
    try {
        const aria = document.querySelector("#container").innerHTML;
        const dir = location.pathname.substring(1).split("/");

        if (dir[0]) {
            if (dir[1]) {
                let userinfo = fetch(`https://api.github.com/users/${dir[0]}`);
                userinfo = userinfo.json();

                if (userinfo.message == "Not Found") new Error("[Github API] User: Not Found");

                let repoinfo = fetch(`https://api.github.com/repos/${dir[0]}/_cpost`);
                repoinfo = repoinfo.json();

                if (userinfo.message == "Not Found") return location.href = `/${dir[0]}`;

                const target = location.pathname.substring(location.pathname.indexOf(dir[0]) + dir[1].length + 1);

                fetch(`https://raw.githubusercontent.com/${dir[0]}/_cpost/main/${target}.md`)
                    .then(res => res.text())
                    .then(data => {
                        aria = markdown.parse(escape(data));
                    })
            } else {
                let userinfo = fetch(`https://api.github.com/users/${dir[0]}`);
                userinfo = userinfo.json();

                if (userinfo.message == "Not Found") new Error("[Github API] User: Not Found");

                let repoinfo = fetch(`https://api.github.com/repos/${dir[0]}/_cpost`);
                repoinfo = repoinfo.json();

                if (userinfo.message == "Not Found") repoinfo = {
                    created_at: "null",
                    pushed_at: "null"
                };

                switch (userinfo.type) {
                    case "User":
                        fetch("/.template/user.md")
                            .then(res => res.text())
                            .then(data => {
                                [["followers", data.followers], ["created_at", repoinfo.created_at], ["pushed_at", repoinfo.pushed_at], ["followings", data.following], ["userName", dir[0]]].forEach(info => {
                                    data = data.replaceAll(`%${info[0]}%`, info[1]);
                                });
                                aria = markdown.parse(escape(data));
                            })
                            .catch(e => new Error(e));
                        break;
                    case "Organization":
                        let members = fetch(`https://api.github.com/orgs/${dir[0]}/members`);
                        members = (members.json()).length;

                        fetch("/.template/org.md")
                            .then(res => res.text())
                            .then(data => {
                                [["followers", data.followers], ["members", members], ["created_at", repoinfo.created_at], ["pushed_at", repoinfo.pushed_at], ["followings", data.following], ["userName", dir[0]]].forEach(info => {
                                    data = data.replaceAll(`%${info[0]}%`, info[1]);
                                });
                                aria = markdown.parse(escape(data));
                            })
                            .catch(e => new Error(e));
                        break;
                
                    default:
                        new Error(`Error: unknown type: ${data.type}`);
                        break;
                }
            }
        } else {
            const params = new URLSearchParams(window.location.search);
            switch (params.get("page").toLocaleLowerCase) {
                case "about":
                    fetch("/.template/pin/about.md")
                        .then(res => res.text())
                        .then(data => aria = markdown.parse(escape(data)))
                        .catch(e => new Error(e));
                    break;
                case "community":
                    fetch("/.template/pin/community.md")
                        .then(res => res.text())
                        .then(data => aria = markdown.parse(escape(data)))
                        .catch(e => new Error(e));
                    break;
                case null:
                case "hub":
                case "home":
                    fetch("/.template/pin/hub.md")
                        .then(res => res.text())
                        .then(data => aria = markdown.parse(escape(data)))
                        .catch(e => new Error(e));
                    break;
                default:
                    new Error("404 Not Found");
                    break;
            }
        }
    } catch(e) {
        fetch("/.template/error.md")
                .then(res => res.text())
                .then(data => {
                    data = data.replaceAll("%error%", e);
                    aria = markdown.parse(escape(data));
                })
                .catch(e => console.log("Error: loop"));
            break;
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await markdown.ready;
        request()
        document.title = "Loading... | %siteTitle%";
        const cache = document.documentElement.innerHTML;
        config.spaceArg.forEach(data => {
            cache = cache.replaceAll(`%${data[0]}%`, data[1]);
        });
        document.documentElement.innerHTML = cache;
    } catch (e) {
        console.log(e);
        location.href = location.origin;
    }
})