const inputSv = document.getElementById("inp-sv");
const inputPlural = document.getElementById("inp-pl");
const inputEn = document.getElementById("inp-en");
const selectGender = document.getElementById("sel-gender");
const inputClasses = document.getElementById("inp-class");
const inputTags = document.getElementById("inp-tags");
const textareaComment = document.getElementById("txt-comment");

document.getElementById("btn-back").addEventListener("click", () => {
    window.history.back();
});

const socket = connectToSocket();

inputSv.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Word: inputSv.value.trim() });
});

inputPlural.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Plural: inputPlural.value.trim() });
});

inputEn.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, En: inputEn.value.trim() });
});

selectGender.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Gender: selectGender.value });
});

inputClasses.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Class: inputClasses.value });
});

inputTags.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Tags: inputTags.value });
});

textareaComment.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Comment: textareaComment.value });
});

function clear() {
    inputSv.value = "";
    inputPlural.value = "";
    inputEn.value = "";
    spanClasses.innerHTML = "";
    spanCategories.innerHTML = "";
    textareaComment.value = "";
}

socket.on("alert", text => {
    window.alert(text);
});

socket.on("get-word-raw", obj => {
    console.log(obj)
    if (obj == null) {
        ok = false;
        alert(`No word found for the given query -- '${query}'.`);
        window.location.href = "./";
    } else {
        ID = obj.ID;
        ok = true;

        inputSv.value = obj.Word || "";
        inputPlural.value = obj.Plural || "";
        inputEn.value = obj.En || "";
        selectGender.value = obj.Gender || "";
        textareaComment.value = obj.Comment || "";
        inputClasses.value = obj.Class || "";
        inputTags.value = obj.Tags || "";
    }
});

const params = new URLSearchParams(location.search);
var ID = params.get("id"), query, ok = true;
if (ID == undefined) {
    query = prompt("Enter the ID or the Swedish of the word to edit");
} else {
    query = +ID;
}

socket.emit("get-word-raw", query);
