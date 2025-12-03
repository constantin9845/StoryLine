export default class Input {
    constructor() {
        this.keyMap = { a: false, d: false, " ": false };

        window.addEventListener("keydown", e => {
            if (this.keyMap.hasOwnProperty(e.key)) {
                this.keyMap[e.key] = true;
            }
        });

        window.addEventListener("keyup", e => {
            if (this.keyMap.hasOwnProperty(e.key)) {
                this.keyMap[e.key] = false;
            }
        });
    }

    isPressed(key) {
        return this.keyMap[key];
    }
}
