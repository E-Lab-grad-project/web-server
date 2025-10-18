// ...existing code...
const bulbToggle = document.getElementById("bulb-toggle");

async function sendLed(state) {
    try {
        const res = await fetch(`/led/${state}`, { method: "GET" });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            console.error(`Server responded with ${res.status}: ${text}`);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function setup() {
    console.log("running script.js");

    if (!bulbToggle) {
        console.warn("bulb toggle element not found");
        return;
    }

    bulbToggle.checked = false;

    bulbToggle.addEventListener("change", function () {
        if (this.checked) {
            console.log("Light Bulb turned on!");
            sendLed("on");
        } else {
            console.log("Light Bulb turned off!");
            sendLed("off");
        }
    });
}

window.onload = setup;