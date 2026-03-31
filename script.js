let historyStack = ["screen1"];

function goTo(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));

    let id = "screen" + screen;
    document.getElementById(id).classList.remove("hidden");

    historyStack.push(id);
}

function back() {
    if (historyStack.length > 1) {
        historyStack.pop();
        let prev = historyStack[historyStack.length - 1];

        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        document.getElementById(prev).classList.remove("hidden");
    }
}

function processing(nextScreen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));

    let temp = document.createElement("div");
    temp.className = "screen";
    temp.style.display = "flex";
    temp.innerHTML = "<h1>Processing...</h1>";

    document.body.appendChild(temp);

    setTimeout(() => {
        temp.remove();
        goTo(nextScreen);
    }, 2000);
}
function validateInput(inputId, nextScreen) {
    let value = document.getElementById(inputId).value.trim();

    // ❌ invalid conditions
    if (value.length < 10 || /^[a-zA-Z0-9]+$/.test(value)) {
        goTo("invalid");
        return;
    }

    // ✅ valid → continue
    goTo(nextScreen);
}
