// const fontAwesome = document.createElement("link");
// fontAwesome.rel = "stylesheet";
// fontAwesome.href =
//   "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
// document.head.appendChild(fontAwesome);

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const buttonContainer = document.querySelector(".col-md-12").children[3];
const backButton = buttonContainer.querySelector(".btn-info");
const cancelButton = buttonContainer.querySelector(".btn-danger");
const submitButton = buttonContainer.querySelector(".btn-success");
const addButton = document.createElement("button");

//Adicionar botão de "Adicionar HMTL" e "Menu de chars" na inicialização
if (buttonContainer) {
  buttonContainer.style.marginBottom = "40px";
  buttonContainer.style.display = "flex";
  backButton.style.marginRight = "5px";
  cancelButton.style.marginRight = "5px";

  addButton.innerText = "Salvar novo HTML";
  addButton.classList.add("btn", "btn-default", "btn-primary");
  addButton.style.marginLeft = "43%";

  addButton.onclick = function (event) {
    event.preventDefault(); // Impede a ação do botão de sucesso
    event.stopPropagation(); // Para evitar que o clique propague para o botão de submit
    openFakePopup(); // Ao clicar, abre o popup
  };

  // Adiciona o botão após o botão de submit
  submitButton.insertAdjacentElement("afterend", addButton);

  // Verifica se há personagens e cria o botão "Menu de Chars"
  if (getCharacters().length > 0) {
    addButton.style.marginLeft = "37%";
    createMenuButton();
  }
}

// Função para obter personagens do localStorage
function getCharacters() {
  return JSON.parse(localStorage.getItem("characters")) || [];
}

// Função para abrir o fake popup
function openFakePopup(charData = {}) {
  // Cria o elemento do popup
  const popupContainer = document.createElement("div");
  popupContainer.id = "popupContainer";
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.zIndex = "1000";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.padding = "20px";
  popupContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

  // HTML do popup
  const popupHTML = `
<div class="form-container">
  <h3>Salvar novo html</h3>

  <form id="charForm">
    <div class="first-question">
      <label for="charName" class="name-label">Nome do personagem:</label>
      <div class="input-and-small">
        <input
          type="text"
          class="name-input"
          id="charName"
          placeholder="personagem"
          required
        />
        <small class="helper-text"
          >Por favor, insira um nome com até 10 caracteres.</small
        >
      </div>
    </div>
    <div class="second-question">
      <div class="question-top">
        <label for="charHtml">HTML da narração:</label>
        <button
          type="button"
          class="help-button"
          title="Coloque o HTML e destaque com a palavra 'TEXTO' onde você quer o texto do personagem"
        >
          ?
        </button>
      </div>
      <textarea
        id="charHtml"
        class="text-html"
        placeholder="<html>TEXTO</html>"
        required
        rows="12"
      ></textarea>
    </div>

    <div class="third-question">
      <div class="question-top">
        <label for="charSpeech">HTML da fala (opcional):</label>
        <button
          type="button"
          class="help-button"
          title="Coloque o HTML e destaque com a palavra 'FALA' onde você quer a fala do personagem"
        >
          ?
        </button>
      </div>
      <input
        type="text"
        id="charSpeech"
        class="fala-html"
        placeholder="<b>— FALA —</b>"
        required
      />
    </div>

    <div class="button-group">
      <button type="button" id="saveChar">Salvar</button>
      <button type="button" id="closePopup">Fechar</button>
    </div>
  </form>
</div>

<style>
  .form-container {
    font-family: inherit;
    font-size: 13px;
    width: 600px; /* Dobro do tamanho */
    height: 700px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .first-question {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
  }

  .name-label {
    margin-top: -10px;
    height: 30px;
  }

  .name-input {
    width: 340px;
  }

  .input-and-small {
    display: flex;
    flex-direction: column;
  }

  .helper-text {
    margin-left: 10px;
  }

  .first-question,
  .second-question,
  .third-question {
    margin: 20px 30px 0 30px;
    margin-bottom: 30px; /* Space below each question */
  }

  .question-top {
    display: flex;
    margin-right: 30px;
    margin-bottom: 5px;
  }

  label {
    display: block; /* Ensure label takes full width */
    font-weight: bold; /* Make the label bold */
    margin-bottom: 5px; /* Space between label and input */
  }

  input[type="text"] {
    padding: 8px; /* Add padding for better appearance */
    border: 1px solid #ccc; /* Border for input */
    border-radius: 4px; /* Rounded corners */
  }

  input[type="text"]:focus {
    border-color: #007bff; /* Change border color on focus */
    outline: none; /* Remove default outline */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Add shadow on focus */
  }

  h3 {
    text-align: center;
    color: #333;
    font-family: Arial, sans-serif;
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align items to start */
  }

  label {
    font-weight: bold;
    margin-right: 10px;
    flex: 1; /* Take available space */
  }

  input[type="text"],
  textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    flex: 2; /* Take remaining space */
  }

  textarea {
    resize: vertical;
    margin-top: 5px; /* Add space above the textarea */
  }

  input[type="text"]:focus,
  textarea:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  .text-html {
    width: 500px;
    overflow: auto; /* Allow scrolling when content overflows */
    resize: none; /* Prevent resizing the textarea */
  }

  .fala-html {
    width: 500px;
  }

  .help-button {
    margin-left: 100px; /* Space between label and button */
    padding: 4px 8px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
  }

  .help-button:hover {
    background-color: #0056b3;
  }

  .button-group {
    margin: 10px 80px;
    display: flex;
    justify-content: space-between;
  }

  .button-group button {
    flex: 1;
    padding: 10px;
    margin: 5px;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .button-group button#closePopup {
    background-color: #dc3545;
  }

  .button-group button:hover {
    background-color: #218838;
  }

  .button-group button#closePopup:hover {
    background-color: #c82333;
  }
</style>
  `;

  // Adiciona o HTML ao popup
  popupContainer.innerHTML = popupHTML;
  document.body.appendChild(popupContainer);

  let id = "";
  // Preenche os campos se for uma edição
  if (charData.charName) {
    id = charData.id;
    document.getElementById("charName").value = charData.charName;
    document.getElementById("charHtml").value = charData.html;
    document.getElementById("charSpeech").value = charData.fala;
  }

  // Event Listeners
  document.getElementById("saveChar").onclick = () => {
    saveCharacter(id);
  };
  document.getElementById("closePopup").onclick = () => {
    document.body.removeChild(popupContainer);
  };
}

// Função para salvar o personagem
function saveCharacter(charId = "") {
  const id = charId == "" ? generateUUID() : charId;
  const charName = document.getElementById("charName").value.trim();
  const charHtml = document.getElementById("charHtml").value.trim();
  const charSpeech = document.getElementById("charSpeech").value.trim();

  const charData = { id, charName, html: charHtml, fala: charSpeech };

  // Verificações
  if (!charName) {
    alert("Nome do personagem é obrigatório!");
    return;
  } else if (charName.length > 8) {
    alert("Coloque um nome de no máximo 8 letras");
    return;
  }
  const [part1, part2] = charHtml;
  if (!charHtml.includes("TEXTO") && (!part1 || !part2)) {
    alert(
      "HTML da narração deve conter a palavra 'TEXTO' separada entre espaços!"
    );
    return;
  }
  const [falaPart1, falaPart2] = charSpeech;
  if (charSpeech) {
    if (!charSpeech.includes("FALA") && (!falaPart1 || !falaPart2)) {
      alert("HTML da fala deve conter 'FALA' separada entre espaços!");
      return;
    }
  } else {
    charData.fala = " — FALA — ";
  }

  const characters = getCharacters();
  const existingCharIndex = characters.findIndex((char) => char.id === id);

  if (existingCharIndex > -1) {
    characters[existingCharIndex] = charData; // Atualiza se já existir
  } else {
    characters.push(charData); // Adiciona novo personagem
  }

  localStorage.setItem("characters", JSON.stringify(characters));

  // Atualiza o menu de chars
  if (characters.length === 1) {
    addButton.style.marginLeft = "37%";
    createMenuButton();
  } else if (characters.length > 1) {
    const dropdownContainer = document.getElementById(
      "dropdown-container-chars"
    );
    const dropdownMenu = dropdownContainer.querySelector(".dropdown-menu");
    loadCharacterDropdown(dropdownMenu);
  }

  // Fecha o popup
  document.getElementById("popupContainer").remove();
}

function createMenuButton() {
  // Create the container for the dropdown
  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = "dropdown-container-chars";
  dropdownContainer.classList.add("dropdown");

  // Create the menu button
  const menuButton = document.createElement("button");
  menuButton.innerHTML = `<i class="fa fa-bars"></i> <span class="caret"></span>`;
  menuButton.classList.add(
    "btn",
    "btn-default",
    "btn-secondary",
    "dropdown-toggle"
  );
  menuButton.setAttribute("data-toggle", "dropdown");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.style.marginLeft = "5px";

  // Create the dropdown menu
  const dropdownMenu = document.createElement("ul");

  dropdownMenu.classList.add("dropdown-menu");
  dropdownMenu.style.padding = "10px";
  dropdownMenu.style.width = "170px";
  dropdownMenu.style.maxHeight = "150px";
  dropdownMenu.style.overflowY = "auto";

  //fazer a lista crescer para cima
  // dropdownMenu.style.display = "flex";
  // dropdownMenu.style.flexDirection = "column-reverse";
  // dropdownMenu.style.alignItems = "flex-start";

  dropdownMenu.style.marginTop = "-100px";
  dropdownMenu.style.marginLeft = "-115px";

  // Add the button and menu to the dropdown container
  dropdownContainer.appendChild(menuButton);
  dropdownContainer.appendChild(dropdownMenu);

  // Add the dropdown after the "Adicionar HTML" button
  addButton.insertAdjacentElement("afterend", dropdownContainer);

  // Populate the dropdown with saved characters (if needed)
  const characters = getCharacters(); // Assuming getCharacters() is already defined
  populateDropdownMenu(characters, dropdownMenu);
}

// Função para carregar personagens no dropdown (caso seja atualizado)
function loadCharacterDropdown(dropdownMenu) {
  dropdownMenu.innerHTML = ""; // Limpa a lista antes de adicionar os personagens

  const characters = getCharacters();
  if (characters.length === 0) {
    const dropdownContainer = document.getElementById(
      "dropdown-container-chars"
    );
    dropdownContainer.innerHTML = "";
    addButton.style.marginLeft = "43%";
  } else {
    populateDropdownMenu(characters, dropdownMenu);
  }
}

function colocarHTML(char) {
  const textElement = document.querySelector(".note-editable.panel-body");
  const text = textElement.innerHTML;

  const { html, fala } = char;
  const [htmlPart1, htmlPart2] = html.split("TEXTO");
  const [lineStart, lineEnd] = fala.split("FALA");

  let isLineStart = true;
  let newText = [];

  console.log("lineStart :>> ", lineStart);
  console.log("lineEnd :>> ", lineEnd);

  for (let i = 0; i < text.length; i++) {
    if ((text[i] == "~" || text[i] == "—") && isLineStart) {
      newText.push(lineStart);
      isLineStart = false;
    } else if ((text[i] == "~" || text[i] == "—") && isLineStart == false) {
      newText.push(lineEnd);
      isLineStart = true;
    } else newText.push(text[i]);
  }

  textElement.innerHTML = `${htmlPart1}${newText.join("")}${htmlPart2}`;
}

function normalizeHtmlPreservingTextContent(html) {
  let insideTag = false;
  let result = "";

  const n = html.length ?? 0;

  // Iterate through the string and only remove spaces when inside an HTML tag
  for (let i = 0; i < n; i++) {
    const char = html[i];

    if (char === "<") {
      insideTag = true; // We're inside an HTML tag
    } else if (char === ">") {
      insideTag = false; // We've exited the tag
    }

    // Remove spaces if inside a tag, otherwise keep them
    if (insideTag && /\s/.test(char)) {
      continue; // Skip whitespace inside tags
    }

    result += char;
  }

  return result.trim();
}

function buscarParteERemover(parteHtml, texto) {
  const normalizedTexto = normalizeHtmlPreservingTextContent(texto).trim();
  const normalizedTextoComImgBar = normalizeHtmlPreservingTextContent(texto)
    .replace(/<img([^>]*)>/g, "<img$1/>")
    .trim();

  const normalizedParteHtml =
    normalizeHtmlPreservingTextContent(parteHtml).trim();
  const m = normalizedParteHtml.length;

  function busca(texto, n) {
    // Percorre o texto principal
    for (let i = 0; i <= n - m; i++) {
      let j;

      // Compara a substring do texto com o padrão
      for (j = 0; j < m; j++) {
        if (texto[i + j] !== normalizedParteHtml[j]) {
          break; // Se houver um caractere diferente, sai do laço
        }
      }

      // Se o laço interno completou sem interrupção, encontramos a substring
      if (j === m) {
        // Remove a substring substituindo por um espaço
        const inicio = i;
        const fim = i + m - 1;
        const textoModificado = texto.slice(0, i) + " " + texto.slice(i + m);
        return { inicio, fim, text: textoModificado.trim() }; // Remove espaços extras e retorna o texto resultante
      }
    }
    return null;
  }

  // Tenta encontrar e remover a parte HTML no texto normalizado sem barra
  const n = normalizedTexto.length;
  let resultado = busca(normalizedTexto, n);
  if (resultado) return resultado;

  // Se não encontrou, tenta encontrar e remover no texto com barra
  const nb = normalizedTextoComImgBar.length;
  resultado = busca(normalizedTextoComImgBar, nb);
  if (resultado) return resultado;

  return { inicio: -1, fim: -1, texto };
}

function buscarParteDaFalaERemover(parteHtml, texto) {
  const normalizedTexto = normalizeHtmlPreservingTextContent(texto).trim();
  const n = normalizedTexto.length;

  const normalizedParteHtml =
    normalizeHtmlPreservingTextContent(parteHtml).trim();
  const m = normalizedParteHtml.length;

  // Percorre o texto principal
  for (let i = 0; i <= n - m; i++) {
    let j;

    // Compara a substring do texto com o padrão
    for (j = 0; j < m; j++) {
      if (normalizedTexto[i + j] !== normalizedParteHtml[j]) {
        break; // Se houver um caractere diferente, sai do laço
      }
    }

    // Se o laço interno completou sem interrupção, encontramos a substring
    if (j === m) {
      // Remove a substring substituindo por um espaço
      const inicio = i;
      const fim = i + m - 1;
      const textoModificado =
        normalizedTexto.slice(0, i) + "~" + normalizedTexto.slice(i + m);
      return { inicio, fim, text: textoModificado.trim() }; // Remove espaços extras e retorna o texto resultante
    }
  }

  return { inicio: -1, fim: -1, texto };
}

function tirarHTML(char) {
  const textElement = document.querySelector(".note-editable.panel-body");
  let text = textElement.innerHTML;

  const { html, fala } = char;
  let [htmlPart1, htmlPart2] = html.split("TEXTO");

  text = buscarParteERemover(htmlPart1, text).text;
  text = buscarParteERemover(htmlPart2, text).text;

  let [falaPart1, falaPart2] = fala.split("FALA");

  let n = text.length;
  let result;
  for (let i = 0; i < n / 2; i++) {
    result = buscarParteDaFalaERemover(falaPart1, text);
    if (result.inicio == -1) {
      break;
    }
    text = result.text;
    result = buscarParteDaFalaERemover(falaPart2, text);
    text = result.text;
  }

  textElement.innerHTML = text;
}

function populateDropdownMenu(characters, dropdownMenu) {
  if (characters.length == 1) {
    dropdownMenu.style.marginTop = "-100px";
  } else if (characters.length == 2) {
    dropdownMenu.style.marginTop = "-130px";
  } else if (characters.length == 3) {
    dropdownMenu.style.marginTop = "-165px";
  } else if (characters.length >= 4) {
    dropdownMenu.style.marginTop = "-192px";
  }

  let selectedButton = null;

  characters.forEach((char) => {
    const charItem = document.createElement("li");
    charItem.style.display = "flex";
    charItem.style.justifyContent = "space-between";
    charItem.style.alignItems = "center";
    charItem.style.marginBottom = "5px";

    const charButton = document.createElement("button");
    charButton.innerText = char.charName;
    charButton.style.display = "block";
    charButton.style.textAlign = "left";

    charButton.style.background = "none"; // Remove o fundo do botão
    charButton.style.border = "none"; // Remove a borda do botão
    charButton.style.color = "inherit"; // Usa a cor do texto normal
    charButton.style.font = "inherit"; // Usa a fonte do texto normal
    charButton.style.cursor = "pointer"; // Estiliza o cursor como pointer
    charButton.style.padding = "0"; // Remove padding extra

    charButton.style.flexGrow = "1"; // Faz o botão ocupar o espaço à esquerda

    charButton.onclick = (event) => {
      event.preventDefault(); // Impede o comportamento padrão
      event.stopPropagation();

      // Check if another button is already selected
      if (selectedButton == null) {
        charButton.style.fontWeight = "bold"; // Estiliza como selecionado
        charButton.style.color = "black"; // Muda a cor quando selecionado
        colocarHTML(char); // Chama a função ao clicar, passando o personagem como argumento

        selectedButton = charButton; // Track the selected button
        charButton.character = char; // Track the character to remove html later
      } else if (selectedButton && selectedButton !== charButton) {
        // Deselect the currently selected button
        const oldCharButton = selectedButton;
        oldCharButton.style.fontWeight = "normal"; // Volta ao estado normal
        oldCharButton.style.color = "inherit"; // Restaura a cor original
        tirarHTML(oldCharButton.character); // Assuming tirarHTML exists

        // Select the new one
        charButton.style.fontWeight = "bold"; // Estiliza como selecionado
        charButton.style.color = "black"; // Muda a cor quando selecionado
        selectedButton = charButton;
        charButton.character = char;
        colocarHTML(char);
      } else {
        charButton.style.fontWeight = "normal"; // Volta ao estado normal
        charButton.style.color = "inherit"; // Restaura a cor original
        tirarHTML(char);
        selectedButton = null;
      }
    };

    // Edit button for the character
    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fa fa-edit"></i>`;
    editButton.classList.add("btn", "btn-warning", "btn-sm");
    editButton.style.marginRight = "5px";
    editButton.onclick = (event) => {
      event.preventDefault(); // Impede o comportamento padrão
      event.stopPropagation(); // Para evitar que o clique propague para o botão de submit
      openFakePopup(char); // Assuming openFakePopup(char) is defined
    };

    // Delete button for the character
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.onclick = (event) => {
      event.preventDefault(); // Impede o comportamento padrão
      event.stopPropagation(); // Para evitar que o clique propague para o botão de submit
      deleteCharacter(char.id); // Assuming deleteCharacter(charName) is defined
      loadCharacterDropdown(dropdownMenu); // Assuming loadCharacterDropdown(dropdownMenu) is defined to refresh the menu
    };

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex"; // Coloca os botões lado a lado
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    // Append the link and buttons to the list item
    charItem.appendChild(charButton);
    charItem.appendChild(buttonContainer);

    dropdownMenu.appendChild(charItem);
  });
}

// Função para deletar um personagem
function deleteCharacter(id) {
  let characters = getCharacters();
  characters = characters.filter((char) => char.id !== id);
  localStorage.setItem("characters", JSON.stringify(characters));
}

// Salvar texto se fechar a aba
const textBox = document.querySelector(".note-editable.panel-body");

if (textBox) {
  textBox.addEventListener("input", function () {
    let content = textBox;
    localStorage.setItem("userText", removeDivTags(htmlToString(content)));
  });

  window.addEventListener("load", () => {
    const savedContent = localStorage.getItem("userText");
    if (textBox && savedContent) {
      textBox.innerText = savedContent; // Ou innerHTML, se estiver usando HTML
    }
  });
}

function htmlToString(element) {
  // Check if the input is a string (selector) or an actual HTML element
  if (typeof element === "string") {
    // If it's a selector, use querySelector to get the element
    const el = document.querySelector(element);
    if (el) {
      return el.outerHTML; // Return the outer HTML as a string
    } else {
      return null; // Return null if the element is not found
    }
  } else if (element instanceof HTMLElement) {
    // If it's an actual HTML element, return its outerHTML
    return element.outerHTML;
  } else {
    return null; // Return null for invalid input
  }
}

// function cleanTextBoxContent(text) {
//   const part1 =
//     '<span class="selectable-text copyable-text" style="white-space-collapse: preserve;">';
//   text = buscarParteERemover(part1, text).text;
//   const part2 = "</span>";
//   text = buscarParteERemover(part2, text).text;

//   return text;
// }

function removeDivTags(inputString) {
  // Regex to match the specific <div> with variable height at the start
  const startRegex =
    /^<div class="note-editable panel-body" contenteditable="true" style="height:\s*\d+px;">/;
  // Regex to match the closing </div> at the end
  const endRegex = /<\/div>$/;

  // Remove the opening <div> tag
  let resultString = inputString.replace(startRegex, "");
  // Remove the closing </div> tag
  resultString = resultString.replace(endRegex, "");

  return resultString.trim(); // Trim any extra whitespace from the result
}
