const breadcrumbs = document.querySelector(".breadcrumbs");
const centre = document.querySelector(".centre");
const pronouns = ["Io", "Tu", "Lui/Lei", "Noi", "Voi", "Loro"];

/** Load word information */
function load(word) {
    window.word = word;

    const italian = word.It; //word.It.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    // Title
    const h1Title = document.createElement("h1");
    h1Title.innerText = italian;
    h1Title.classList.add("fancy-font");
    elInitSpeak(h1Title);
    centre.appendChild(h1Title);
    if (word.ItPlural) centre.insertAdjacentHTML("beforeend", `<p><em>Pl.</em> ${word.ItPlural}</p>`);

    // Breadcrumbs
    breadcrumbs.insertAdjacentHTML("beforeend", `&gt; <a>${italian}</a>`);
    setWindowTitle();

    const div = document.createElement("div");
    div.classList.add("indent");
    document.body.appendChild(div);

    // Base word definition
    let sect = document.createElement('section');
    div.appendChild(sect);
    sect.insertAdjacentHTML("beforeend", `<p><strong>${word.Class.map(x => "<em>" + x + "</em>").join(", ")}</strong></p>`);
    sect.insertAdjacentHTML("beforeend", `<ul>${word.En.map(x => "<li>" + x + "</li>").join('\n')}</ul>`);
    if (word.Image) sect.insertAdjacentHTML("beforeend", `<br><img src='${word.Image}' /><br>`);
    if (word.Comment) sect.insertAdjacentHTML("beforeend", `<fieldset><legend>Comment</legend><span>${word.Comment.replace(/\r\n|\r|\n/g, '<br>')}</span></fieldset>`);
    sect.insertAdjacentHTML("beforeend", "<hr>");

    if (word.Class.includes("Verb")) {
        verbGetStem(word);
        auxVerbGetStem(word);
        if (word.Verb.ContractedInfin) contractedVerbGetStem(word);

        sect = document.createElement('section');
        div.appendChild(sect);
        sect.insertAdjacentHTML("beforeend", "<h2>Verb Overview</h2>");
        let p = document.createElement("p");
        sect.appendChild(p);
        const irregular = word.Class.includes("IrregVerb");
        p.insertAdjacentHTML("beforeend", `<span><em>${word.It[0].toUpperCase() + word.It.slice(1)}</em> is ${irregular ? "an <strong>irregular</strong>" : "a <strong>regular</strong>"} verb.</span>`);
        if (word.Verb.ContractedInfin) p.insertAdjacentHTML("beforeend", `<br><span>It has a contracted infinitive, which is <em>${word.Verb.ContractedInfin}</em>.</span>`);
        if (!irregular) p.insertAdjacentHTML("beforeend", `<br><span>It's stem is <strong>${word.Verb.Stem}-</strong>, and it is a <strong>-${word.Verb.InfEnding}</strong> verb.</span>`);
        p.insertAdjacentHTML("beforeend", `<br><span>It's auxiliary verb is <em>${word.AuxVerb.It}</em>.</span>`);

        const presentParticiple = word.Verb.PresentParticiple || verbGeneratePresentParticiple(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding, true);
        if (!word.Verb.PresentParticiple) word.Verb.PresentParticiple = verbGeneratePresentParticiple(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding);
        const pastParticiple = word.Verb.PastParticiple || verbGeneratePastParticiple(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding, true);
        if (!word.Verb.PastParticiple) word.Verb.PastParticiple = verbGeneratePastParticiple(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding);
        const gerund = word.Verb.Gerund || verbGenerateGerund(word.Verb.PresentParticiple, true);
        if (!word.Verb.Gerund) word.Verb.Gerund = verbGenerateGerund(word.Verb.PresentParticiple);
        const futureStem = word.Verb.FutureStem || verbGenerateFutureStem(word.It, false);

        sect.insertAdjacentHTML("beforeend", "<h2>Nominal Forms</h2>");
        p = document.createElement("p");
        sect.appendChild(p);
        p.insertAdjacentHTML("beforeend", `<span>Present Participle: <em class='speak'>${presentParticiple}</em>.</span>`);
        p.insertAdjacentHTML("beforeend", `<br><span>Past Participle: <em class='speak'>${pastParticiple}</em>.</span>`);
        p.insertAdjacentHTML("beforeend", `<br><span>Gerund: <em class='speak'>${gerund}</em>.</span>`);
        p.insertAdjacentHTML("beforeend", `<br><span>Future Stem: <em class='speak'>${futureStem}-</em>.</span>`);

        // Present
        sect = document.createElement('section');
        div.appendChild(sect);
        sect.insertAdjacentHTML("beforeend", "<h2>The Present - <em>Il Presente</em></h2>");
        sect.insertAdjacentHTML("beforeend", `<p>Present participle - <em class='speak'>${presentParticiple}</em></p>`);

        let presentHTML;
        if (word.Verb.Present) {
            let ar = word.Verb.Present.split(",").map(x => x.trim()).filter(x => x.length > 0);
            if (ar.length === 1) { // Act as insert to regular endings
                presentHTML = verbGeneratePresent(word.Verb.Stem, word.Verb.InfEnding, ar[0], true);
            } else {
                presentHTML = ar.map(x => "<strong>" + x + "</strong>");
            }
        } else {
            presentHTML = verbGeneratePresent(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding, "", true);
        }
        let table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        let tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${presentHTML[i]}</td></tr>`);
        });
        sect.insertAdjacentHTML("beforeend", "<hr>");

        // Past
        sect = document.createElement('section');
        div.appendChild(sect);
        sect.insertAdjacentHTML("beforeend", "<h2>The Past - <em>Il Passato</em></h2>");
        sect.insertAdjacentHTML("beforeend", `<p>Past participle - <em class='speak'>${pastParticiple}</em></p>`);

        sect.insertAdjacentHTML("beforeend", "<h3>The Present Perfect - <em>Il Passato Prossimo</em></h3>");
        sect.insertAdjacentHTML("beforeend", `<p>Formation: auxiliary verb + past participle - <strong class='speak'>${word.AuxVerb.It}</strong> + <strong class='speak'>${word.Verb.PastParticiple}</strong></p>`);
        const presentPerfectHTML = verbGeneratePresentPerfect(word.Verb, word.AuxVerb, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${presentPerfectHTML[i]}</td></tr>`);
        });

        sect.insertAdjacentHTML("beforeend", "<h3>The Imperfect - <em>L'imperfetto</em></h3>");
        if (word.Verb.ContractedInfin) sect.insertAdjacentHTML("beforeend", `<p><strong>NOTE</strong> the imperfect uses the <strong>contracted</strong> infinitive, <em class='speak'>${word.Verb.ContractedInfin}</em></p>`);
        let imperfectHTML;
        if (word.Verb.Imperfect) {
            imperfectHTML = word.Verb.Imperfect.split(",").map(x => "<strong>" + x.trim() + "</strong>");
        } else {
            imperfectHTML = verbGenerateImperfect(word.Verb.ContractedStem || word.Verb.Stem, word.Verb.ContractedInfEnding || word.Verb.InfEnding, true);
        }
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${imperfectHTML[i]}</td></tr>`);
        });

        sect.insertAdjacentHTML("beforeend", "<h3>The Past Perfect - <em>Il trapassato prossimo</em></h3>");
        sect.insertAdjacentHTML("beforeend", `<p>Formation: auxiliary verb in the Imperfect + past participle - <strong class='speak'>${word.AuxVerb.It}</strong> + <strong class='speak'>${word.Verb.PastParticiple}</strong></p>`);
        let pastPerfectHTML = verbGeneratePastPerfect(pastParticiple, word.AuxVerb, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${pastPerfectHTML[i]}</td></tr>`);
        });
        sect.insertAdjacentHTML("beforeend", "<hr>");

        // Future
        sect = document.createElement('section');
        div.appendChild(sect);
        sect.insertAdjacentHTML("beforeend", "<h2>The Future - <em>Il Futuro</em></h2>");
        sect.insertAdjacentHTML("beforeend", `<p>Future Stem - <em class='speak'>${futureStem}</em>-</p>`);
        let futureHTML = verbGenerateFuture(futureStem, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${futureHTML[i]}</td></tr>`);
        });

        sect.insertAdjacentHTML("beforeend", "<h3>The Future Perfect - <em>Il Futuro Anteriore</em></h3>");
        sect.insertAdjacentHTML("beforeend", `<p>Formation: auxiliary verb in the Future + past participle - <strong class='speak'>${word.AuxVerb.It}</strong> + <strong class='speak'>${word.Verb.PastParticiple}</strong></p>`);
        const futurePerfectHTML = verbGenerateFuturePerfect(pastParticiple, word.AuxVerb.It, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${futurePerfectHTML[i]}</td></tr>`);
        });
        sect.insertAdjacentHTML("beforeend", "<hr>");

        // Conditional
        sect = document.createElement('section');
        div.appendChild(sect);
        sect.insertAdjacentHTML("beforeend", "<h2>The Conditional - <em>Il condizionale</em></h2>");
        sect.insertAdjacentHTML("beforeend", `<p>The Future Stem - <em class='speak'>${futureStem}</em></p>`);
        const conditionalHTML = verbGenerateConditional(futureStem, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${conditionalHTML[i]}</td></tr>`);
        });

        sect.insertAdjacentHTML("beforeend", "<h3>The Past Conditional - <em>Il condizionale passato</em></h3>");
        sect.insertAdjacentHTML("beforeend", `<p>Formation: auxiliary verb in the Conditional + past participle - <strong class='speak'>${word.AuxVerb.It}</strong> + <strong class='speak'>${word.Verb.PastParticiple}</strong></p>`);
        const conditionalPastHTML = verbGenerateConditionalPast(pastParticiple, word.AuxVerb.It, true);
        table = document.createElement("table");
        sect.appendChild(table);
        table.classList.add("border");
        table.insertAdjacentHTML("beforeend", `<thead><tr><th></th><th class='speak'>${word.Verb.Stem}<strong>${word.Verb.InfEnding}</strong></th></tr></thead>`);
        tbody = table.createTBody();
        pronouns.forEach((pronoun, i) => {
            tbody.insertAdjacentHTML("beforeend", `<tr><td class='speak'>${pronoun}</td><td class='speak'>${conditionalPastHTML[i]}</td></tr>`);
        });
        sect.insertAdjacentHTML("beforeend", "<hr>");

        // Imperative
        // sect = document.createElement('section');
        // div.appendChild(sect);
        // sect.insertAdjacentHTML("beforeend", "<h2>The Imperative - <em>L’imperativo</em></h2>");

        loadSpeakText();
    }
}

const socket = connectToSocket();
socket.on("get-word-info", info => {
    load(info);
});

const params = new URLSearchParams(location.search);
const id = params.has("id") ? +params.get("id") : +prompt("Enter word ID");
socket.emit("get-word-info", id);