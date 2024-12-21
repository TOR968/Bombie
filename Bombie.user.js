// ==UserScript==
// @name         Bombie Catizen Auto-Clicker
// @version      2.1
// @author       TOR968
// @match        https://games.pluto.vision/games/bombie*
// @grant        none
// @icon         none
// @downloadURL  https://raw.githubusercontent.com/TOR968/Bombie/refs/heads/main/Bombie.user.js
// @updateURL    https://raw.githubusercontent.com/TOR968/Bombie/refs/heads/main/Bombie.user.js
// @homepage     https://github.com/TOR968/Bombie
// ==/UserScript==

class ClickAutomation {
    constructor() {
        this.isRunning = false;
        this.currentButtonIndex = 0;
        this.markerSize = 20;
        this.coordinateMarkers = [];
        this.buttons = [];
        this.baseDelay = 1;
        this.loadSettings();
        this.createControlPanel();
    }

    saveSettings() {
        try {
            const settings = {
                coordinates: this.buttons,
                delay: this.baseDelay,
            };
            localStorage.setItem("clickAutomationSettings", JSON.stringify(settings));
            console.log("Settings saved:", settings);
        } catch (error) {
            console.error("Error saving settings to local storage:", error);
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem("clickAutomationSettings");
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.buttons = settings.coordinates || [];
                this.baseDelay = settings.delay || 1;
                console.log("Settings loaded:", settings);
            }

            if (!this.buttons || this.buttons.length === 0) {
                this.buttons = [
                    {
                        x: 0.5 * document.getElementById("GameCanvas").offsetWidth,
                        y: document.getElementById("GameCanvas").offsetHeight - 80,
                    },
                ];
            }
        } catch (error) {
            console.error("Error loading settings from local storage:", error);
            this.buttons = [
                {
                    x: 0.5 * document.getElementById("GameCanvas").offsetWidth,
                    y: document.getElementById("GameCanvas").offsetHeight - 80,
                },
            ];
            this.baseDelay = 1;
        }
    }

    createButtonInputs(container, button, index) {
        const buttonLabel = document.createElement("label");
        buttonLabel.textContent = `Button ${index + 1}`;
        buttonLabel.style.display = "flex";
        buttonLabel.style.alignItems = "center";
        buttonLabel.style.gap = "5px";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.gap = "5px";
        buttonContainer.style.marginBottom = "10px";
        buttonContainer.style.padding = "5px";
        buttonContainer.style.border = "1px solid #ccc";
        buttonContainer.style.borderRadius = "5px";

        const coordContainer = document.createElement("div");
        coordContainer.style.display = "flex";
        coordContainer.style.gap = "5px";

        const xInput = document.createElement("input");
        xInput.type = "number";
        xInput.placeholder = `X${index + 1}`;
        xInput.value = button.x;
        xInput.style.width = "70px";

        const yInput = document.createElement("input");
        yInput.type = "number";
        yInput.placeholder = `Y${index + 1}`;
        yInput.value = button.y;
        yInput.style.width = "70px";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.style.padding = "2px 6px";
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.borderRadius = "3px";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", () => {
            if (this.buttons.length > 1) {
                this.buttons.splice(index, 1);
                this.updateSettingsPanel();
                this.saveSettings();
                this.updateCoordinateMarkers();
            }
        });

        buttonLabel.appendChild(deleteButton);
        coordContainer.appendChild(xInput);
        coordContainer.appendChild(yInput);
        buttonContainer.appendChild(buttonLabel);
        buttonContainer.appendChild(coordContainer);
        container.appendChild(buttonContainer);

        return { xInput, yInput };
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
        settingsPanel.style.maxHeight = "60vh";

        const delayContainer = document.createElement("div");
        delayContainer.style.display = "flex";
        delayContainer.style.flexDirection = "column";
        delayContainer.style.gap = "5px";
        delayContainer.style.marginBottom = "10px";
        delayContainer.style.padding = "5px";
        delayContainer.style.border = "1px solid #ccc";
        delayContainer.style.borderRadius = "5px";

        const delayLabel = document.createElement("label");
        delayLabel.textContent = "Delay (seconds)";
        delayLabel.style.display = "flex";
        delayLabel.style.alignItems = "center";
        delayLabel.style.gap = "5px";

        const delayInput = document.createElement("input");
        delayInput.type = "number";
        delayInput.min = "0.1";
        delayInput.step = "0.1";
        delayInput.value = this.baseDelay;
        delayInput.style.width = "70px";
        delayInput.addEventListener("change", () => {
            this.baseDelay = Math.max(0.1, parseFloat(delayInput.value));
            this.saveSettings();
        });

        delayContainer.appendChild(delayLabel);
        delayContainer.appendChild(delayInput);

        const scrollContainer = document.createElement("div");
        scrollContainer.style.overflowY = "auto";
        scrollContainer.style.maxHeight = "calc(60vh - 120px)";
        scrollContainer.style.paddingRight = "5px";
        scrollContainer.style.marginRight = "-5px";
        scrollContainer.style.scrollbarWidth = "thin";
        scrollContainer.style.scrollbarColor = "#888 #f1f1f1";

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .scroll-container::-webkit-scrollbar {
                width: 5px;
            }
            .scroll-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 5px;
            }
            .scroll-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 5px;
            }
            .scroll-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(styleSheet);
        scrollContainer.classList.add("scroll-container");

        const buttonInputsContainer = document.createElement("div");
        scrollContainer.appendChild(buttonInputsContainer);

        expandButton.addEventListener("click", () => {
            if (settingsPanel.style.display === "none") {
                settingsPanel.style.display = "flex";
                expandButton.textContent = "✖️";
            } else {
                settingsPanel.style.display = "none";
                expandButton.textContent = "⚙️";
            }
        });

        const addButtonContainer = document.createElement("div");
        addButtonContainer.style.display = "flex";
        addButtonContainer.style.justifyContent = "center";
        addButtonContainer.style.marginBottom = "10px";
        addButtonContainer.style.marginTop = "10px";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Button";
        addButton.style.padding = "5px 10px";
        addButton.style.backgroundColor = "green";
        addButton.style.color = "white";
        addButton.style.border = "none";
        addButton.style.borderRadius = "3px";
        addButton.style.cursor = "pointer";
        addButton.addEventListener("click", () => {
            const canvas = document.getElementById("GameCanvas");
            this.buttons.push({
                x: 0.5 * canvas.offsetWidth,
                y: canvas.offsetHeight - 80,
            });
            this.updateSettingsPanel();
            this.saveSettings();
            this.updateCoordinateMarkers();

            setTimeout(() => {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }, 0);
        });

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update Settings";
        updateButton.style.padding = "10px";
        updateButton.style.backgroundColor = "blue";
        updateButton.style.color = "white";
        updateButton.style.border = "none";
        updateButton.style.borderRadius = "5px";
        updateButton.style.cursor = "pointer";

        addButtonContainer.appendChild(addButton);
        settingsPanel.appendChild(delayContainer);
        settingsPanel.appendChild(scrollContainer);
        settingsPanel.appendChild(addButtonContainer);
        settingsPanel.appendChild(updateButton);

        controlContainer.appendChild(toggleButton);
        controlContainer.appendChild(expandButton);
        controlContainer.appendChild(settingsPanel);

        document.body.appendChild(controlContainer);
        this.toggleButton = toggleButton;
        this.settingsPanel = settingsPanel;
        this.buttonInputsContainer = buttonInputsContainer;
        this.updateButton = updateButton;

        this.updateSettingsPanel();
        this.updateCoordinateMarkers();
    }

    updateSettingsPanel() {
        this.buttonInputsContainer.innerHTML = "";
        const inputs = [];

        this.buttons.forEach((button, index) => {
            const { xInput, yInput } = this.createButtonInputs(this.buttonInputsContainer, button, index);
            inputs.push({ xInput, yInput });
        });

        this.updateButton.onclick = () => {
            this.buttons = inputs.map(({ xInput, yInput }) => ({
                x: parseFloat(xInput.value),
                y: parseFloat(yInput.value),
            }));
            this.saveSettings();
            this.updateCoordinateMarkers();
        };
    }

    createCoordinateMarker(x, y, index) {
        const canvas = document.getElementById("GameCanvas");
        if (!canvas) return null;

        const markerContainer = document.createElement("div");
        markerContainer.style.position = "absolute";
        markerContainer.style.width = `${this.markerSize}px`;
        markerContainer.style.height = `${this.markerSize}px`;
        markerContainer.style.left = `${x}px`;
        markerContainer.style.top = `${y}px`;
        markerContainer.style.zIndex = "9999";
        markerContainer.style.transform = "translate(-50%, -50%)";

        const circle = document.createElement("div");
        circle.style.width = "100%";
        circle.style.height = "100%";
        circle.style.borderRadius = "50%";
        circle.style.backgroundColor = `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
        circle.style.display = "flex";
        circle.style.alignItems = "center";
        circle.style.justifyContent = "center";
        circle.style.fontSize = `${this.markerSize * 0.7}px`;
        circle.style.color = "white";
        circle.style.fontWeight = "bold";
        circle.style.textShadow = "1px 1px 1px rgba(0,0,0,0.5)";
        circle.textContent = (index + 1).toString();

        markerContainer.appendChild(circle);
        canvas.parentElement.appendChild(markerContainer);
        return markerContainer;
    }

    simulateMouseAfterTouch(x, y, index) {
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
        clickIndicator.style.backgroundColor = `hsla(${(index * 137.5) % 360}, 70%, 50%, 0.5)`;
        clickIndicator.style.pointerEvents = "none";
        clickIndicator.style.zIndex = "9999";
        clickIndicator.style.transform = "scale(0)";
        clickIndicator.style.transition = "all 0.3s ease-out";

        clickIndicator.style.display = "flex";
        clickIndicator.style.alignItems = "center";
        clickIndicator.style.justifyContent = "center";
        clickIndicator.style.fontSize = "20px";
        clickIndicator.style.color = "white";
        clickIndicator.style.textShadow = "1px 1px 1px rgba(0,0,0,0.5)";
        clickIndicator.textContent = (index + 1).toString();

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
            console.log(`mousedown button ${index + 1}`);

            setTimeout(() => {
                canvas.dispatchEvent(mouseUp);
                console.log(`mouseup button ${index + 1}`);

                setTimeout(() => {
                    canvas.dispatchEvent(click);
                    console.log(`click button ${index + 1}`);

                    setTimeout(() => {
                        clickIndicator.remove();
                    }, 300);
                }, 50);
            }, 50);
        }, 50);
    }

    updateCoordinateMarkers() {
        this.clearCoordinateMarkers();
        this.coordinateMarkers = this.buttons.map((button, index) =>
            this.createCoordinateMarker(button.x, button.y, index)
        );
    }

    clearCoordinateMarkers() {
        this.coordinateMarkers.forEach((marker) => marker?.remove());
        this.coordinateMarkers = [];
    }

    getRandomOffset() {
        return {
            x: Math.random() * 5 - 4,
            y: Math.random() * 5 - 4,
        };
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
        if (!this.buttons || this.buttons.length === 0) {
            console.error("No buttons available for clicking.");
            this.stopAutomation();
            return;
        }
        const currentButton = this.buttons[this.currentButtonIndex];
        if (!currentButton) {
            console.error("Current button is undefined.");
            this.stopAutomation();
            return;
        }
        this.simulateMouseAfterTouch(currentButton.x, currentButton.y, this.currentButtonIndex);
        this.currentButtonIndex = (this.currentButtonIndex + 1) % this.buttons.length;
        const randomDelay = this.baseDelay * 1000 + Math.random() * 500;
        setTimeout(() => this.runNextClick(), randomDelay);
    }
}

const clickAutomation = new ClickAutomation();
