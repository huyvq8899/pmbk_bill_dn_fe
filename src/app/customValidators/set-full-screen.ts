export function go_full_screen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

