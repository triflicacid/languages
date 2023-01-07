window.addEventListener("load", function () {
  const content = document.getElementById("content");

  const textarea = document.createElement("textarea");
  textarea.rows = 15;
  textarea.cols = 150;
  textarea.lang = "it";
  textarea.spellcheck = true;
  textarea.value = "Inserisci qui il tuo italiano.";
  content.appendChild(textarea);

  content.insertAdjacentHTML("beforeend", "<br><br>");
  const btnSpeak = document.createElement("button");
  btnSpeak.innerText = "Speak";
  btnSpeak.addEventListener('click', () => speak(textarea.value.trim()));
  content.appendChild(btnSpeak);
  content.insertAdjacentText("beforeend", " | ");
  const btnClear = document.createElement("button");
  btnClear.innerText = "Clear";
  btnClear.addEventListener('click', () => textarea.value = "");
  content.appendChild(btnClear);
});