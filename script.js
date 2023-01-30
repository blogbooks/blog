const ctrl = {
    menu: (open, close, content) => {
        document.querySelector(open).addEventListener("click", () => {
            document.querySelector("a").setAttribute("style", "display: block;opacity: 0.8;transition-property: opacity;transition-duration: 1s")
        });
        document.querySelector(close).addEventListener("click", () => {
            setTimeout(() => {
                document.querySelector(content).style.display = "none";
            }, 1000)
            document.querySelector(content).style.opacity = "0";
        })
    },
    loadProfile: (name) => {

    },
    loadPost: (author, dir) => {
        fetch(`https://raw.githubusercontent.com/${author}/community_post/main/content/${dir}.md`)
            .then(res => res.text())
            .then(data => {
                document.querySelector("main").innerHTML = markdown.parse(data);
            })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    markdown.ready;
    ctrl.menu(".menu", ".close", ".inMenu");

    if (!(location.pathname.substring(1).split("/").length > 2)) {
        switch (location.pathname.substring(1).split("/").length) {
            case 0:
                loadPost("blogbooks", "welcome");
                break;
            case 1:

                break;
            case 2:
                
                break;
        
            default:
                loadPost("blogbooks", "error");
                break;
        }
    } else {
        
    }
})