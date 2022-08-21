-- Table which holds all category info
CREATE TABLE Categories (
    ID integer PRIMARY KEY AUTOINCREMENT,
    -- Name of category
    Name text,
    -- Category description
    Desc text
);

-- Table which holds all word class imformation
CREATE TABLE Classes (
    ID integer PRIMARY KEY AUTOINCREMENT,
    -- Name of class
    Name text,
    -- Class description
    Desc text
);

-- Table which holds general vocabulary
CREATE TABLE Vocab (
	ID integer PRIMARY KEY AUTOINCREMENT,
    -- Italian word
	It text,
    -- English translation(s) (multiple seperated by comma)
	En text,
    -- Grammatical gender: (NULL), M, F
    Gender text,
    -- Word class e.g. "adverb" (multiple seperated by comma)
	Class text,
    -- Category (multiple seperated by comma)
    Cat text,
    -- OPTIONAL image url
    Image text,
    -- OPTIONAL comment
    Comment text
);

-- Table for Irregular Verbs. If the value is empty, means that it is regular in that tense
CREATE TABLE IrregularVerbs (
    VobabID integer,
    -- Present tense
    Present text,
    -- Contracted infinitive?
    ContractedInfin text,
    -- Stem for the future tenses
    FutureStem text,
    -- Present Participle
    PresentParticiple text,
    -- Past participle
    PastParticiple text,
    -- Infinitive used for past tense (avere/essere/... default is avere)
    PastVerb text,
    -- Imperfect Past
    Imperfect text,
    -- Absolute Past
    AbsPast text,
-- subjunctive
-- subjunctive_imperfect
-- subjunctive_past
-- subjunctive_pluperfect
    -- Imperative
    Imperative text,
    -- Gerund
    Gerund text
);