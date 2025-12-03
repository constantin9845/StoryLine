export default class ClueManager {
    constructor() {
        this.clues = [];
        this.riddle = "";
        this.answer = "";
        this.story = "";
        this.clueElement = document.getElementById("clue");
    }

    setClues(cluesArray) {
        this.clues = cluesArray;
    }

    setRiddle(riddle) {
        this.riddle = riddle;
    }

    setAnswer(answer) {
        this.answer = answer;
    }

    setStory(story) {
        this.story = story;
    }

    check(playerX, mid) {
        for (let i = 0; i < this.clues.length; i++) {
            const [offset, text] = this.clues[i];

            if (Math.abs(mid + offset - playerX) < 30) {
                this.clueElement.innerHTML = text;
                this.clueElement.style.opacity = "1";
                return;
            }
        }

        this.clueElement.style.opacity = "0";
    }

    checkRiddle(playerX, walkRange) {
        if (Math.abs(walkRange - playerX) < 500) {
            this.clueElement.innerHTML = this.riddle;
            this.clueElement.style.opacity = "1";
        }
    }
}
