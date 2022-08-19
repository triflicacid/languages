/** Create properties `word.Verb.Stem` and `word.Verb.InfEnding` */
function verbGetStem(word) {
    let stem, ending = word.It.slice(word.It.length - 3);
    if (ending === "ere" || ending === "are" || ending === "ire") stem = word.It.slice(0, word.It.length - 3);
    word.Verb.Stem = stem;
    word.Verb.InfEnding = ending;
}

/** Create properties `word.AuxVerb.Stem` and `word.AuxVerb.InfEnding` */
function auxVerbGetStem(word) {
    let aux = word.Verb.PastVerb, stem, ending = aux.slice(aux.length - 3);
    if (ending === "ere" || ending === "are" || ending === "ire") stem = aux.slice(0, word.It.length - 3);
    word.AuxVerb.Stem = stem;
    word.AuxVerb.InfEnding = ending;
}

/**
 * Return array of Present Tense of a verb
 * @param stem Stem of verb
 * @param ending Verb ending e.g. "are", "ere", ...
 * @param insert String to insert between stem + verb ending e.g. "isc", "ev", ...
 */
function verbGeneratePresent(stem, ending, insert = '', htmlStyle = false) {
    let endings;
    if (ending === 'are') endings = ['o', 'e', 'a', 'iamo', 'ate', 'ano'];
    else if (ending === 'ere') endings = ['o', 'e', 'i', 'iamo', 'ate', 'ono'];
    else if (ending === 'ire') endings = ['o', 'e', 'i', 'iamo', 'ite', 'ono'];
    else endings = Array.from({ length: 6 }).fill('');
    return htmlStyle ?
        endings.map(e => stem + "<strong><em>" + (insert || "") + "</em>" + e + "</strong>") :
        endings.map(e => stem + insert + e);
}

/** Generate present participle */
function verbGeneratePresentParticiple(stem, ending, htmlStyle = false) {
    let add;
    if (ending === 'are') add = "ante";
    else if (ending === 'ere') add = "ente";
    else if (ending === 'ire') add = "ente";
    else add = "?";
    return htmlStyle ? stem + "<strong>" + add + "</strong>" : stem + add;
}

/** Generate past participle */
function verbGeneratePastParticiple(stem, ending, htmlStyle = false) {
    let add;
    if (ending === 'are') add = "ato";
    else if (ending === 'ere') add = "uto";
    else if (ending === 'ire') add = "ito";
    else add = "?";
    return htmlStyle ? stem + "<strong>" + add + "</strong>" : stem + add;
}

/** Generate Present Perfect from (1) verb to generate Past Perfect for, (2) auxiliary verb. Return array */
function verbGeneratePresentPerfect(verb, aux, htmlStyle = false) {
    let pp = aux.Present.split(",").map((x, i) => (htmlStyle ? "<strong>" + x.trim() + "</strong>" : x.trim()) + " " + verb.PastParticiple);
    if (verb.PastVerb === "essere") {
        pp = pp.map((s, i) => {
            if (i > 2) {
                let a = '';
                if (s[s.length - 1] === 'o') a = 'i';
                else if (s[s.length - 1] === 'a') a = 'e';
                else if (s[s.length - 1] === 'e') a = 'i';
                else return s;
                return s.slice(0, s.length - 1) + a;
            } else {
                return s;
            }
        });
    }
    return pp;
}

/** Generate Past Imperfect */
function verbGenerateImperfect(stem, ending, htmlStyle = false) {
     let endings, insert;
    if (ending === 'are' || ending === 'ere' || ending === 'ire') {
        endings = ['vo', 'vi', 'va', 'vamo', 'vate', 'vano'];
        insert = ending[ending.length - 3];
    } else {
        return Array.from({ length: 6 }).fill('?');
    }
    return htmlStyle ?
        endings.map(e => stem + "<strong><em>" + insert + "</em>" + e + "</strong>") :
        endings.map(e => stem + insert + e);
}

/** Generate past perfect given (1) past participle, (2) the auxiliary verb information */
function verbGeneratePastPerfect(pastParticiple, aux, htmlStyle = false) {
    const imperfect = aux.Imperfect ?
            aux.Imperfect.split(",").map(x => x.trim()) :
            verbGenerateImperfect(aux.ContractedInfin || aux.Stem, aux.InfEnding);
    return htmlStyle ?
        imperfect.map(x => "<strong>" + x + "</strong> " + pastParticiple) :
        imperfect.map(x => x + " " + pastParticiple);
}

/** Given an italian verb string, return the altered future stem */
function verbGenerateFutureStem(verb, isIrregular = false) {
    if (verb === "essere") return "sar";
    if (verb === "stare" || verb === "dare" || verb === "fare") return verb.slice(0, verb.length - 1);
    
    let stem = verb;
    // End in -are -> -ere?
    if (verb.slice(verb.length - 3) === "are") stem = verb.slice(0, verb.length - 3) + "are";
    // Remove final 'e'
    if (stem[stem.length - 1] === "e") stem = stem.slice(0, stem.length - 1);
    // Most irregular verbs remove vowel before final 'r'
    if (isIrregular) stem = stem.slice(0, stem.length - 2) + stem[stem.length - 1];
    // Clusters -nr- and -lr- -> -rr-
    if (stem.endsWith("nr") || stem.endsWith("lr")) stem = stem.slice(0, stem.length - 2) + "rr";
    return stem;
}

/** Generate the future from the FUTURE stem */
function verbGenerateFuture(futureStem, htmlStyle = false) {
    const ends = ["ò", "ai", "à", "emo", "ete", "anno"];
    return htmlStyle ? ends.map(x => futureStem + "<strong>" + x + "</strong>") : ends.map(x => futureStem + x);
}

/** Generate future perfect given (1) past participle, (2) the auxiliary verb string */
function verbGenerateFuturePerfect(pastParticiple, aux, htmlStyle = false) {
    const fStem = verbGenerateFutureStem(aux, true);
    const future = verbGenerateFuture(fStem, htmlStyle);
    return htmlStyle ?
        future.map(x => "<strong>" + x + "</strong> " + pastParticiple) :
        future.map(x => x + " " + pastParticiple);
}

/** Generate the Present Conditional given the FUTURE stem */
function verbGenerateConditional(futureStem, htmlStyle = false) {
    const endings = ["ei", "esti", "ebbe", "emmo", "este", "ebbero"];
    return htmlStyle ? endings.map(e => futureStem + "<strong>" + e + "</strong>") : endings.map(e => futureStem + e);
}

/** Generate the Past Conditional given the auxiliary verb STRING */
function verbGenerateConditionalPast(pastParticiple, aux, htmlStyle = false) {
    const fStem = verbGenerateFutureStem(aux, true);
    const cond = verbGenerateConditional(fStem, htmlStyle);
    return htmlStyle ?
        cond.map(x => "<strong>" + x + "</strong> " + pastParticiple) :
        cond.map(x => x + " " + pastParticiple);
}

/** Create Gerund from a present participle */
function verbGenerateGerund(presentParticiple, htmlStyle = false) {
    return htmlStyle ? 
        presentParticiple.slice(0, presentParticiple.length - 4) + "<strong>" + presentParticiple.slice(presentParticiple.length - 4, presentParticiple.length - 2) + "do</strong>" :
        presentParticiple.slice(0, presentParticiple.length - 2) + "do";
}