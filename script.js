const ctrl = {
    menu: (open, close, content) => {
        document.querySelector(open).addEventListener("click", () => {
            document.querySelector(open).setAttribute("style", "display: block;opacity: 0.8;transition-property: opacity;transition-duration: 1s")
        });
        document.querySelector(close).addEventListener("click", () => {
            setTimeout(() => {
                document.querySelector(content).style.display = "none";
            }, 1000)
            document.querySelector(content).style.opacity = "0";
        })
    },
    loadProfile: (name) => {
        fetch(``)
    },
    loadPost: (author, dir) => {
        // 一応
        if (dir.search("?") !== -1 || dir.search("#") !== -1) return document.querySelector("main").innerHTML = "[Detect Danger] contains # or ?";
        fetch(`https://raw.githubusercontent.com/${author}/community_post/main/content/${dir}.md`)
            .then(res => res.text())
            .then(data => {
                if (data == "404: Not Found") return document.querySelector("main").innerHTML = "404: Not Found";
                document.querySelector("main").innerHTML = markdown.parse(data);
            })
            .catch(() => {
                document.querySelector("main").innerHTML = "Network Error";
            })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    markdown.ready;
    ctrl.menu(".menu", ".close", ".inMenu");
    let info = "";

    if (location.pathname.endsWith("/")) {
        info = location.pathname.substring(1, location.pathname.length - 1);
    } else {
        info = location.pathname.substring(1);
    }

    switch (info.split("/").length) {
        case 0:
            loadPost("blogbooks", ".views/welcome");
            break;
        case 1:
            loadProfile(info.substring(1).split("/")[0]);
            break;

        default:
            loadPost(info.substring(1).split("/")[0], info.substring(info.indexOf(location.pathname.substring(1).split("/")[1])));
            break;
    }
})