"use strict";

const ctrl = {
    menu: (open, close, content) => {
        document.querySelector(open).addEventListener("click", () => {
            document.querySelector(content).style.display = "block";
        });
        document.querySelector(close).addEventListener("click", () => {
            document.querySelector(content).style.display = "none";
        })
    },
    loadProfile: (name) => {
    },
    loadPost: (author, dir) => {
        // 一応
        if (dir.indexOf("?") !== -1 || dir.indexOf("#") !== -1) return document.querySelector("main").innerHTML = "[Detect Danger] contains # or ?";

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

/* StartLine */

// call markdown
markdown.ready;

// set menu
ctrl.menu(".menu", ".close", ".inMenu");

// get access info: URL
let info = "";
if (location.pathname.endsWith("/") && location.pathname !== "/") {
    info = location.pathname.substring(1, location.pathname.length - 1);
} else {
    info = location.pathname.substring(1);
}

// switch
switch (info.split("/").length) {
    case 1:
        if (info == null) {
            ctrl.loadPost("blogbooks", ".views/welcome");
        } else {
            ctrl.loadProfile(info.substring(1).split("/")[0]);
        }
        break;
    default:
        ctrl.loadPost(info.substring(1).split("/")[0], info.substring(info.indexOf(info.split("/")[1])));
        break;
}