window.addEventListener("load", function () {
  const content = document.getElementById("content");
  var langData;

  let p = document.createElement("p");
  p.innerText = "Select a language: ";
  const select = document.createElement("select");
  p.appendChild(select);
  for (const code in codes) {
    select.insertAdjacentHTML("beforeend", `<option value='${code}'>${codes[code].name}</option>`);
  }
  content.appendChild(p);


  const textarea = document.createElement("textarea");
  textarea.rows = 15;
  textarea.cols = 150;
  textarea.spellcheck = true;
  content.appendChild(textarea);

  content.insertAdjacentHTML("beforeend", "<br><br>");
  const btnSpeak = document.createElement("button");
  btnSpeak.innerText = "Speak";
  btnSpeak.addEventListener('click', () => speak(textarea.value.trim(), langData.lang));
  content.appendChild(btnSpeak);
  content.insertAdjacentText("beforeend", " | ");
  const btnClear = document.createElement("button");
  btnClear.innerText = "Clear";
  btnClear.addEventListener('click', () => textarea.value = "");
  content.appendChild(btnClear);

  select.addEventListener("change", () => {
    langData = codes[select.value];
    langData.code = select.value;
    for (const span of document.getElementsByClassName("lang-name"))
      span.innerText = langData.name;
    textarea.lang = langData.code;
    document.body.dataset.code = langData.code;
  });
  select.dispatchEvent(new Event("change"));
});