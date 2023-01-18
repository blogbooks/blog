const config = {
    "spaceArg": [
        ["siteTitle","BlogBooks Community"], ["discord.inviteURL", "https://discord.gg/Fk8FJt7Dsb"], [""]
    ]
}

function request() {
    try {
        const aria = document.querySelector("#container").innerHTML;
        const dir = location.pathname.substring(1).split("/");

        if (dir[0]) {
            
        } else {
            const params = new URLSearchParams(window.location.search);
            switch (params.get("page").toLocaleLowerCase) {
                case "about":
                    
                    break;
                case "community":
                    fetch("/.template/pin/community.md")
                        .then(res => res.text())
                        .then(data => aria = markdown.parse(data))
                        .catch(() => new Error());
                    break;
                case null:
                    fetch("/.template/pin/hub.md")
                        .then(res => res.text())
                        .then(data => aria = markdown.parse(data))
                        .catch(() => new Error());
                    break;
                default:
                    new Error()
                    break;
            }
        }
    } catch(e) {

    }

    if (location.pathname == ("" || null || undefined || "/")) {
        const type = "hub";
    } else if (location.pathname.split[1] && location.pathname.split[2] == ("" || null)) {
        const type = "profile";
    } else if (location.pathname.split[1] && location.pathname.split[2]) {
        const type = "blog";
    } else {
        const type = "error";
    }

    switch (type) {
        case "hub":
            const params = new URLSearchParams(window.location.search);
            if (params.has("page")) {
                fetch(`https://raw.githubusercontent.com/blogbooks/contents/main/${params.get("page")}.md`)
                    .then(res => res.text())
                    .then(data => {
                        aria = markdown.parse(data);
                    })
            }
            break;
        case "profile":
            fetch(`https://api.github.com/users/${author}`)
                .then(res => res.json())
                .then(data => {
                    if (data.message == "Not Found") {
                        aria = markdown.parse("# Not Found")
                    } else {
                        if (data.type == "User") {
                            aria = markdown.parse(``)
                        } else if (data.type == "Organization") {

                        }
                    }
                })
                .catch(() => new Error())
            break;
        case "blog":

            break;
        case "error":
            break;
    }
    try {
        if (location.pathname == "" || location.pathname == "/") {
            fetch("/.md")
                .then(res => res.text())
                .then(data => {
                    aria.innerHTML = markdown.parse(data);
                })
        }
        const author = location.pathname.split("/")[1];
        fetch(`https://api.github.com/users/${author}`)
            .then(res => res.json())
            .then(data => {
                if (data.message == "Not Found") {
                    new Error();
                } else {
                    if (data.type == "User") {
                        
                    } else if (data.type == "Organization") {

                    }
                }
            })
            .catch(() => new Error())

        fetch(`https://raw.githubusercontent.com/${author}/_cposts/main/${name}`)
            .then(res => res.text())
            .then(text => console.log(text))
        switch (name) {
            case "posts":
            
                break;
    
            default:
                break;
        }
    } catch(e) {
        return new Error("Error: at request function")
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await markdown.ready;
        request()
        document.title = "";
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