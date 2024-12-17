class ClickAutomation {
    constructor() {
        this.isRunning = false;
        this.buttons = [
            {
                x: 0.5 * document.getElementById("GameCanvas").offsetWidth,
                y: document.getElementById("GameCanvas").offsetHeight - 80,
            },
            {
                x: 0.5 * document.getElementById("GameCanvas").offsetWidth + 40,
                y: document.getElementById("GameCanvas").offsetHeight - 80,
            },
        ];
        this.currentButtonIndex = 0;
        this.createToggleButton();
    }

    getRandomOffset() {
        return {
            x: Math.random() * 8 - 4,
            y: Math.random() * 8 - 4,
        };
    }

    createToggleButton() {
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "OFF";
        toggleButton.style.position = "absolute";
        toggleButton.style.top = "10px";
        toggleButton.style.right = "10px";
        toggleButton.style.zIndex = "10000";
        toggleButton.style.padding = "10px";
        toggleButton.style.backgroundColor = "red";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.cursor = "pointer";

        toggleButton.addEventListener("click", () => {
            this.toggleAutomation();
        });

        document.body.appendChild(toggleButton);
        this.toggleButton = toggleButton;
    }

    simulateMouseAfterTouch(x, y) {
        const canvas = document.getElementById("GameCanvas");
        if (!canvas) return;

        const offset = this.getRandomOffset();
        x += offset.x;
        y += offset.y;

        const clickIndicator = document.createElement("div");
        clickIndicator.style.position = "absolute";
        clickIndicator.style.left = `${x}px`;
        clickIndicator.style.top = `${y}px`;
        clickIndicator.style.width = "40px";
        clickIndicator.style.height = "40px";
        clickIndicator.style.borderRadius = "50%";
        clickIndicator.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        clickIndicator.style.pointerEvents = "none";
        clickIndicator.style.zIndex = "9999";
        clickIndicator.style.transform = "scale(0)";
        clickIndicator.style.transition = "all 0.3s ease-out";

        canvas.parentElement.appendChild(clickIndicator);

        const mouseEventOptions = {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
        };

        setTimeout(() => {
            clickIndicator.style.transform = "scale(1)";
            clickIndicator.style.opacity = "0";
        }, 10);

        const mouseMove = new MouseEvent("mousemove", mouseEventOptions);
        const mouseDown = new MouseEvent("mousedown", mouseEventOptions);
        const mouseUp = new MouseEvent("mouseup", mouseEventOptions);
        const click = new MouseEvent("click", mouseEventOptions);

        canvas.dispatchEvent(mouseMove);
        setTimeout(() => {
            canvas.dispatchEvent(mouseDown);
            console.log("mousedown");

            setTimeout(() => {
                canvas.dispatchEvent(mouseUp);
                console.log("mouseup");

                setTimeout(() => {
                    canvas.dispatchEvent(click);
                    console.log("click");

                    setTimeout(() => {
                        clickIndicator.remove();
                    }, 300);
                }, 50);
            }, 50);
        }, 50);
    }

    startAutomation() {
        this.isRunning = true;
        this.toggleButton.textContent = "ON";
        this.toggleButton.style.backgroundColor = "green";
        this.runNextClick();
    }

    stopAutomation() {
        this.isRunning = false;
        this.toggleButton.textContent = "OFF";
        this.toggleButton.style.backgroundColor = "red";
    }

    toggleAutomation() {
        if (this.isRunning) {
            this.stopAutomation();
        } else {
            this.startAutomation();
        }
    }

    runNextClick() {
        if (!this.isRunning) return;
        const currentButton = this.buttons[this.currentButtonIndex];
        this.simulateMouseAfterTouch(currentButton.x, currentButton.y);
        this.currentButtonIndex = (this.currentButtonIndex + 1) % this.buttons.length;
        const randomDelay = 1000 + Math.random() * 500;
        setTimeout(() => this.runNextClick(), randomDelay);
    }
}

const clickAutomation = new ClickAutomation();
