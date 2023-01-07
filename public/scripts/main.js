var __speak_rate = 1;

window.addEventListener("load", function () {
    speechSynthesis.getVoices(); // Start population of voices
    setLinkTitles();
    setWindowTitle();
    loadBreadcrumbs();
    seperateSections();
    loadSpeakText();
    loadSpeechSlider();
});

// Insert breaks between <section/> in main content
function seperateSections() {
    const divs = document.querySelectorAll(".main");
    for (const div of divs) {
        const sections = div.querySelectorAll("section");
        let i = 0;
        for (const section of sections) {
            if (i < sections.length - 1) section.insertAdjacentHTML("afterend", "<hr/>");
            i += 1;
        }
    }
}

// Set tab window from first encountered breadcrumbs' contents
function setWindowTitle() {
    const breadcrumbs = document.querySelectorAll(".breadcrumbs"), items = [];
    if (breadcrumbs && breadcrumbs.length > 0) {
        const links = breadcrumbs[0].querySelectorAll("a");
        for (const link of links) items.push(link.innerText);
        items.shift();
    }
    document.title = "Italian" + (items.length === 0 ? "" : " | " + items.join(" | "));
}

// Set <a/> title to its href if unset
function setLinkTitles() {
    const links = document.querySelectorAll("a");
    for (const link of links) {
        let title = link.getAttribute("title");
        if (title === "" || title == null) link.setAttribute("title", link.href);
    }
}

// Take <a/> in <div class="breadcrumbs" /> and make nice
function loadBreadcrumbs() {
    const divs = document.querySelectorAll(".breadcrumbs");
    for (const div of divs) {
        const links = div.querySelectorAll("a"), count = links.length;
        let i = 0;
        for (const link of links) {
            if (i < count - 1) link.insertAdjacentHTML("afterend", " &gt; ");
            i += 1;
        }
    }
}

function speak(text, lang = "it-IT") {
    window.speechSynthesis.cancel();
    let utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = __speak_rate;
    utter.voice = speechSynthesis.getVoices().find(voice => voice.lang === lang);
    window.speechSynthesis.speak(utter);
}

/** Load text with .speak class */
function loadSpeakText() {
    const els = document.getElementsByClassName("speak");
    for (const el of els) elInitSpeak(el);
}

function elInitSpeak(el) {
    if (el.dataset.initSpeak !== 'true') {
        el.classList.add("speak");
        el.title = (el.title ? el.title + ' ' : '') + "(Click to speak)";
        el.addEventListener("click", () => speak(el.innerText));
        el.dataset.initSpeak = true;
    }
}

function loadSpeechSlider() {
    const container = document.querySelector(".breadcrumbs");
    const div = document.createElement("div");
    div.classList.add("speech-settings");
    container.appendChild(div);
    const desc = document.createElement("abbr");
    desc.innerText = "Speech Speed: ";
    desc.title = "Speed: " + (__speak_rate * 100) + "%";
    div.appendChild(desc);
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0.5";
    input.step = "0.1";
    input.max = "2";
    input.value = "1";
    input.addEventListener("change", () => {
        __speak_rate = +input.value;
        desc.title = "Speed: " + (__speak_rate * 100) + "%";
    });
    div.appendChild(input);
}

function removeSpaces(str) {
    return str.replace(/\s+/g, '');
}

function removePunctuation(str) {
    return str.replace(/[\.\?!,:;\-\[\]\(\)\{\}'"]/g, '');
}