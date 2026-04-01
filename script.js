
const screenTexts = {
    2: "Are You A Student ?",
    3: "Do You Have Skills ?",
    4: "Are You Confident With Your Skills ?",
    5: "Why should STARK INDUSTRY Hire You ?",
    6: "Tell Us Something About Yourself Which Makes You Special",
    8: "Congratulations! You're not special",
    9: "How Dare You To Click Next!"
};
let audioUnlocked = false;
let hasCelebrated = false;
let typingInterval = null;
let isTyping = false;
let processTimer = null;
let historyStack = ["screen1"];

let warningAudio = new Audio("warning.mp3");
let typingAudio = new Audio("typing.mp3");
typingAudio.loop = true;

/* NAVIGATION */
function goTo(screen){

    // stop warning sound
    warningAudio.pause();
    warningAudio.currentTime = 0;

    // stop processing timer
    if (processTimer) {
        clearTimeout(processTimer);
        processTimer = null;
    }

    // stop typing
    if (typingInterval) {
        clearTimeout(typingInterval);
        isTyping = false;
        typingAudio.pause();
    }

    // processing screen
    if(screen == 7){
        startProcessing();
    }

    // switch screen
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    let id = "screen" + screen;
    document.getElementById(id).classList.add("active");

    // FINAL screen trigger (FIXED TIMING)
if(screen == 10 && !hasCelebrated){
    hasCelebrated = true;

    requestAnimationFrame(() => {
        triggerFinalCelebration();
    });
}

    // warning screens
    if(id.includes("screenpro") || 
       id.includes("screennoskill") || 
       id.includes("screennoconf") || 
       id.includes("screeninvalid")){
        warningAudio.currentTime = 0;
        warningAudio.play();
    }

    // typing text
    if(screenTexts[screen]){
        typeText("text" + screen, screenTexts[screen]);
    }

    // history stack
    if(historyStack[historyStack.length-1] !== id){
        historyStack.push(id);
    }

    // optional confetti on screen 8
    if(screen == 8){
        setTimeout(launchConfetti, 200);
    }
}

/* BACK */
function back(){
    warningAudio.pause();
    warningAudio.currentTime = 0;

    if(processTimer){
        clearTimeout(processTimer);
        processTimer = null;
    }

    if(historyStack.length > 1){
        historyStack.pop();
        let prev = historyStack[historyStack.length - 1];

        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById(prev).classList.add("active");
    }
    // reset celebration if leaving final flow
if(!document.getElementById("screen10").classList.contains("active")){
    hasCelebrated = false;
}
}

/* VALIDATION */
function validateInput(id, next){
    let val = document.getElementById(id).value.trim();

    let hasLetters = /[a-zA-Z]/.test(val);
    let notSpam = !/(.)\1{5,}/.test(val);

    if(val.length < 10 || !hasLetters || !notSpam){
        goTo("invalid");
    }else{
        goTo(next);
    }
}

/* PROCESSING */
function startProcessing(){
    processTimer = setTimeout(()=>{
        goTo(8);
    }, 1500);
}

/* ✅ FIXED CONFETTI (NO DEPENDENCY, ALWAYS WORKS) */
function launchConfetti(){

    console.log("CONFETTI CALLED");

    for(let i = 0; i < 80; i++){

        let c = document.createElement("div");

        c.style.position = "fixed";
        c.style.width = "8px";
        c.style.height = "10px";
        c.style.background = randomColor();
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.top = "-10px";
        c.style.zIndex = "9999";
        c.style.pointerEvents = "none";

        document.body.appendChild(c);

        let angle = Math.random() * Math.PI - Math.PI / 2;
        let speed = Math.random() * 5 + 2;

        let x = 0;
        let y = 0;

        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;

        let gravity = 0.2;

        let anim = setInterval(()=>{

            x += vx;
            y += vy;
            vy += gravity;

            c.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;

            if(y > window.innerHeight + 100){
                c.remove();
                clearInterval(anim);
            }

        }, 16);
    }
}

function randomColor(){
    return ["#ff4d4d","#4da6ff","#ffd24d","#4dff88","#b84dff"][Math.floor(Math.random()*5)];
}

/* TYPING EFFECT */
function typeText(elementId, text, speed = 40) {

    let i = 0;
    const el = document.getElementById(elementId);
    if(!el) return;

    el.innerHTML = "";
    isTyping = true;

    typingAudio.currentTime = 0;
    typingAudio.play();

    function typing() {
        if (!isTyping) return;

        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            typingInterval = setTimeout(typing, speed);
        } else {
            typingAudio.pause();
            isTyping = false;
        }
    }

    typing();
}

/* ✅ FINAL CELEBRATION (CLEAN + SYNCED) */
function triggerFinalCelebration() {

    console.log("FINAL CELEBRATION TRIGGERED");

    // Confetti bursts (better effect)
    let bursts = 0;

    const interval = setInterval(() => {
        launchConfetti();
        bursts++;

        if (bursts >= 4) clearInterval(interval);
    }, 400);

    // Sounds
    const pop = document.getElementById("popSound");
    const rocket = document.getElementById("rocketSound");

    if(rocket){
        rocket.currentTime = 0;
        rocket.play().catch(()=>{});
    }

    setTimeout(()=>{
        if(pop){
            pop.currentTime = 0;
            pop.play().catch(()=>{});
        }
    }, 600);
}
function unlockAudio() {
    if (audioUnlocked) return;

    const silent = new Audio();
    silent.play().catch(() => {});

    warningAudio.play().then(() => {
        warningAudio.pause();
        warningAudio.currentTime = 0;
    }).catch(() => {});

    typingAudio.play().then(() => {
        typingAudio.pause();
        typingAudio.currentTime = 0;
    }).catch(() => {});

    audioUnlocked = true;

    console.log("Audio Unlocked");
}
document.addEventListener("click", unlockAudio, { once: true });


