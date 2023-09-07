CREATE TABLE Vocab (
	ID integer PRIMARY KEY AUTOINCREMENT,
    -- Swedish word
	Word text,
    -- English translation(s) (multiple seperated by comma)
	En text,
	-- Swedish plural
	Plural,
   -- Grammatical gender: (NULL), C, N
   Gender text,
    -- Word class e.g. "adverb" (multiple seperated by comma)
	Class text,
    -- Tags (multiple seperated by comma)
    Tags text,
    -- OPTIONAL comment
    Comment text
);
