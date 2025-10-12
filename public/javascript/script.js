const bulbToggle = document.getElementById("bulb-toggle");

bulbToggle.addEventListener("change", function () {
    if (this.checked) {
        console.log("Light Bulb turned on!");
        fetch("/led/on", { method: "GET" });
    } else {
        console.log("Light Bulb turned off!");
        fetch("/led/off", { method: "GET" });
    }
});

function setup() {
    console.log("running script.js");

    bulbToggle.checked = false;
}

window.onload = setup;