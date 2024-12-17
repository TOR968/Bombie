class ClickAutomation {
    constructor() {
        this.isRunning = false;
        this.currentButtonIndex = 0;
        this.coordinateMarkers = [];
        this.buttons = [];
        this.loadCoordinates();
        this.createControlPanel();
    }

    saveCoordinates() {
        try {
            localStorage.setItem("clickAutomationCoordinates", JSON.stringify(this.buttons));
            console.log("Coordinates saved:", this.buttons);
        } catch (error) {
            console.error("Error saving coordinates to local storage:", error);
        }
    }

    loadCoordinates() {
        try {
            const savedCoordinates = localStorage.getItem("clickAutomationCoordinates");
            if (savedCoordinates) {
                this.buttons = JSON.parse(savedCoordinates);
                console.log("Coordinates loaded:", this.buttons);
            } else {
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
            }
        } catch (error) {
            console.error("Error loading coordinates from local storage:", error);
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
        }
    }

    createControlPanel() {
        const controlContainer = document.createElement("div");
        controlContainer.style.position = "fixed";
        controlContainer.style.top = "10px";
        controlContainer.style.right = "10px";
        controlContainer.style.zIndex = "10000";
        controlContainer.style.display = "flex";

        const toggleButton = document.createElement("button");
        toggleButton.textContent = "OFF";
        toggleButton.style.padding = "10px";
        toggleButton.style.backgroundColor = "red";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.cursor = "pointer";
        toggleButton.addEventListener("click", () => this.toggleAutomation());

        const expandButton = document.createElement("button");
        expandButton.textContent = "⚙️";
        expandButton.style.padding = "10px";
        expandButton.style.backgroundColor = "gray";
        expandButton.style.color = "white";
        expandButton.style.border = "none";
        expandButton.style.borderRadius = "5px";
        expandButton.style.cursor = "pointer";
        expandButton.style.marginLeft = "5px";

        const settingsPanel = document.createElement("div");
        settingsPanel.style.backgroundColor = "rgba(255,255,255,0.9)";
        settingsPanel.style.padding = "10px";
        settingsPanel.style.borderRadius = "5px";
        settingsPanel.style.display = "none";
        settingsPanel.style.flexDirection = "column";
        settingsPanel.style.gap = "5px";
        settingsPanel.style.width = "200px";

        expandButton.addEventListener("click", () => {
            if (settingsPanel.style.display === "none") {
                settingsPanel.style.display = "flex";
                expandButton.textContent = "✖️";
            } else {
                settingsPanel.style.display = "none";
                expandButton.textContent = "⚙️";
            }
        });

        const firstButtonLabel = document.createElement("label");
        firstButtonLabel.textContent = "Box Button Green";

        const firstXInput = document.createElement("input");
        firstXInput.type = "number";
        firstXInput.placeholder = "X1";
        firstXInput.value = this.buttons[0].x;
        firstXInput.style.width = "100%";
        firstXInput.style.marginBottom = "5px";

        const firstYInput = document.createElement("input");
        firstYInput.type = "number";
        firstYInput.placeholder = "Y1";
        firstYInput.value = this.buttons[0].y;
        firstYInput.style.width = "100%";

        const secondButtonLabel = document.createElement("label");
        secondButtonLabel.textContent = "Equip Button Blue";

        const secondXInput = document.createElement("input");
        secondXInput.type = "number";
        secondXInput.placeholder = "X2";
        secondXInput.value = this.buttons[1].x;
        secondXInput.style.width = "100%";
        secondXInput.style.marginBottom = "5px";

        const secondYInput = document.createElement("input");
        secondYInput.type = "number";
        secondYInput.placeholder = "Y2";
        secondYInput.value = this.buttons[1].y;
        secondYInput.style.width = "100%";

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update Coordinates";
        updateButton.style.padding = "10px";
        updateButton.style.backgroundColor = "blue";
        updateButton.style.color = "white";
        updateButton.style.border = "none";
        updateButton.style.borderRadius = "5px";
        updateButton.style.cursor = "pointer";
        updateButton.addEventListener("click", () => {
            this.clearCoordinateMarkers();

            this.buttons = [
                {
                    x: parseFloat(firstXInput.value),
                    y: parseFloat(firstYInput.value),
                },
                {
                    x: parseFloat(secondXInput.value),
                    y: parseFloat(secondYInput.value),
                },
            ];

            this.saveCoordinates();

            this.coordinateMarkers = [
                this.createCoordinateMarker(this.buttons[0].x, this.buttons[0].y, "green"),
                this.createCoordinateMarker(this.buttons[1].x, this.buttons[1].y, "blue"),
            ];

            console.log("Updated Coordinates:", this.buttons);
        });

        settingsPanel.appendChild(firstButtonLabel);
        settingsPanel.appendChild(firstXInput);
        settingsPanel.appendChild(firstYInput);
        settingsPanel.appendChild(secondButtonLabel);
        settingsPanel.appendChild(secondXInput);
        settingsPanel.appendChild(secondYInput);
        settingsPanel.appendChild(updateButton);

        controlContainer.appendChild(toggleButton);
        controlContainer.appendChild(expandButton);
        controlContainer.appendChild(settingsPanel);

        document.body.appendChild(controlContainer);
        this.toggleButton = toggleButton;

        this.coordinateMarkers = [
            this.createCoordinateMarker(this.buttons[0].x, this.buttons[0].y, "green"),
            this.createCoordinateMarker(this.buttons[1].x, this.buttons[1].y, "blue"),
        ];
    }

    createCoordinateMarker(x, y, color = "red") {
        const canvas = document.getElementById("GameCanvas");
        if (!canvas) return null;

        const marker = document.createElement("div");
        marker.style.position = "absolute";
        marker.style.width = "10px";
        marker.style.height = "10px";
        marker.style.borderRadius = "50%";
        marker.style.backgroundColor = color;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.style.zIndex = "9999";
        marker.style.transform = "translate(-50%, -50%)";

        canvas.parentElement.appendChild(marker);
        return marker;
    }

    clearCoordinateMarkers() {
        this.coordinateMarkers.forEach((marker) => marker.remove());
        this.coordinateMarkers = [];
    }

    getRandomOffset() {
        return {
            x: Math.random() * 8 - 4,
            y: Math.random() * 8 - 4,
        };
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
