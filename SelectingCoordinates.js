class ClickRecorder {
    constructor() {
        this.clicks = [];
        this.createUI();
        this.addClickListener();
    }

    createUI() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "5px";
        container.style.padding = "10px";
        container.style.zIndex = "9999";
        container.style.width = "250px";
        container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        container.style.overflowY = "auto";
        container.style.maxHeight = "300px";

        const title = document.createElement("h3");
        title.textContent = "Click Recorder";
        title.style.margin = "0 0 10px 0";
        title.style.fontSize = "16px";

        this.list = document.createElement("ul");
        this.list.style.listStyleType = "none";
        this.list.style.padding = "0";
        this.list.style.margin = "0";

        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.style.padding = "8px";
        clearButton.style.backgroundColor = "#f44336";
        clearButton.style.color = "white";
        clearButton.style.border = "none";
        clearButton.style.borderRadius = "5px";
        clearButton.style.cursor = "pointer";
        clearButton.style.marginTop = "10px";
        clearButton.addEventListener("click", () => this.clearClicks());

        container.appendChild(title);
        container.appendChild(this.list);
        container.appendChild(clearButton);

        document.body.appendChild(container);
    }

    addClickListener() {
        document.addEventListener("click", (event) => this.recordClick(event));
    }

    recordClick(event) {
        const x = event.clientX;
        const y = event.clientY;
        this.clicks.push({ x, y });

        const listItem = document.createElement("li");
        listItem.textContent = `Click ${this.clicks.length}: (${x}, ${y})`;
        listItem.style.padding = "5px 0";
        this.list.appendChild(listItem);

        console.log(`Click ${this.clicks.length}: (${x}, ${y})`);
    }

    clearClicks() {
        this.clicks = [];
        this.list.innerHTML = "";
    }
}

const clickRecorder = new ClickRecorder();