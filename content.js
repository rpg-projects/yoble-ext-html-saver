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

  addButton.innerText = "Adicionar HTML";
  addButton.classList.add("btn", "btn-default", "btn-primary");
  addButton.style.marginLeft = "45%";

  addButton.onclick = function (event) {
    event.preventDefault(); // Impede a ação do botão de sucesso
    event.stopPropagation(); // Para evitar que o clique propague para o botão de submit
    openFakePopup(); // Ao clicar, abre o popup
  };

  // Adiciona o botão após o botão de submit
  submitButton.insertAdjacentElement("afterend", addButton);

  // Verifica se há personagens e cria o botão "Menu de Chars"
  if (getCharacters().length > 0) {
    addButton.style.marginLeft = "38%";
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
    <div>
      <h3>Adicionar Personagem</h3>
      <form id="charForm">
        <div>
          <label for="charName">Nome do personagem:</label>
          <input type="text" id="charName" placeholder="personagem" required />
        </div>
        <div>
          <label for="charHtml">HTML da narração:</label>
          <input type="text" id="charHtml" placeholder="<html>TEXTO</html>" required />
          <button type="button" title="coloque o html e destaque com a palavra 'TEXTO' onde você quer o texto do personagem">?</button>
        </div>
        <div>
          <label for="charSpeech">HTML da fala:</label>
          <input type="text" id="charSpeech" placeholder="<b>— FALA —</b>" required />
          <button type="button" title="coloque o html e destaque com a palavra 'FALA' onde você quer o texto do personagem">?</button>
        </div>
        <button type="button" id="saveChar">Salvar</button>
        <button type="button" id="closePopup">Fechar</button>
      </form>
    </div>
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
  //   if (!charHtml.includes("TEXTO")) {
  //     alert("HTML da narração deve conter 'TEXTO' e começar com '<html>'!");
  //     return;
  //   }
  //   if (!charSpeech.includes("FALA")) {
  //     alert("HTML da fala deve conter 'FALA'!");
  //     return;
  //   }

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
    addButton.style.marginLeft = "38%";
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
    addButton.style.marginLeft = "45%";
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

  for (let i = 0; i < text.length; i++) {
    if ((text[i] == "~" || text[i] == "—") && isLineStart) {
      newText.push(lineStart);
      isLineStart = false;
    } else if ((text[i] == "~" || text[i] == "—") && isLineStart == false) {
      console.log("fim da fala");
      newText.push(lineEnd);
      isLineStart = true;
    } else newText.push(text[i]);
  }

  textElement.innerHTML = `${htmlPart1}${newText.join("")}${htmlPart2}`;
}

// function tirarHTML(char) {
//   const textElement = document.querySelector(".note-editable.panel-body");
//   let text = textElement.innerHTML;

//   const { html, fala } = char;
//   let [htmlPart1, htmlPart2] = html.split("TEXTO");

//   text = text.replace(htmlPart1, "").replace(htmlPart2, "").trim();
//   console.log("text :>> ", text);

// Substitui os espaços adicionais e ajusta a formatação conforme necessário
// text = text.replace(/\s+/g, " ").trim(); // Remove espaços extras e ajusta a formatação

// console.log(text); // Exibe o texto no console

//
// htmlPart1 = htmlPart1.trim();
// htmlPart2 = htmlPart2.trim();
// const lastLetterHtml1 = htmlPart1[htmlPart1.length - 1];
// const firstLetterHtml2 = htmlPart2[0];

// let [lineStart, lineEnd] = fala.split("FALA");
// lineStart = lineStart.trim();
// lineEnd = lineEnd.trim();

// console.log("text :>> ", text);

// text = text.split(lastLetterHtml1)[1];
// text = text.split(firstLetterHtml2)[0];

// console.log("text :>> ", text);

//   textElement.innerHTML = text;
// }

function buscarParteERemover(parteHtml, texto) {
  const normalizedTexto = texto.replace(/\s+/g, "").trim();
  const normalizedTextoComImgBar = texto
    .replace(/<img([^>]*)>/g, "<img$1/>")
    .replace(/\s+/g, "")
    .trim();

  const normalizedParteHtml = parteHtml.replace(/\s+/g, "").trim();
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
        console.log("inicio :>> ", inicio);
        console.log("fim :>> ", fim);
        const textoModificado = texto.slice(0, i) + " " + texto.slice(i + m);
        return textoModificado.trim(); // Remove espaços extras e retorna o texto resultante
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

  return texto;
}

// function buscarParteERemover(parteHtml, texto) {
//   const normalizedTexto = texto.replace(/\s+/g, "").trim();
//   const normalizedTextoComImgBar = texto
//     .replace(/<img([^>]*)>/g, "<img$1/>")
//     .replace(/\s+/g, "")
//     .trim();

//   const normalizedParteHtml = parteHtml.replace(/\s+/g, "").trim();

//   const existeSubstring = normalizedTexto.includes(normalizedParteHtml);
//   console.log("existeSubstring :>> ", existeSubstring);

//   const indice = normalizedTexto.indexOf(normalizedParteHtml);
//   console.log("indice :>> ", indice);

//   return texto; // Retorna o texto original se a parte não for encontrada
// }

function tirarHTML(char) {
  const textElement = document.querySelector(".note-editable.panel-body");
  let text = textElement.innerHTML;

  const { html, fala } = char;
  let [htmlPart1, htmlPart2] = html.split("TEXTO");

  console.log("text :>> ", text); //está em html no yoble
  console.log("htmlPart1 :>> ", htmlPart1); //meu html - veio com / na img, mas pode ser sem. (preciso comparar dos dois jeitos)

  // console.log("htmlPart1 :>> ", htmlPart1);
  // console.log("htmlPart2 :>> ", htmlPart2);
  // console.log("object :>> ", text);

  text = buscarParteERemover(htmlPart1, text);
  text = buscarParteERemover(htmlPart2, text);

  console.log("text :>> ", text);

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

    let isSelected = false;

    charButton.onclick = (event) => {
      isSelected = !isSelected;
      event.preventDefault(); // Impede o comportamento padrão
      event.stopPropagation();

      if (isSelected) {
        charButton.style.fontWeight = "bold"; // Estiliza como selecionado
        charButton.style.color = "blue"; // Muda a cor quando selecionado
        colocarHTML(char); // Chama a função ao clicar, passando o personagem como argumento
      } else {
        charButton.style.fontWeight = "normal"; // Volta ao estado normal
        charButton.style.color = "inherit"; // Restaura a cor original
        tirarHTML(char);
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
    localStorage.setItem("userText", textBox.innerHTML);
  });

  window.addEventListener("load", () => {
    const savedContent = localStorage.getItem("userText");
    if (textBox && savedContent) {
      console.log("savedContent :>> ", savedContent);
      textBox.innerText = savedContent; // Ou innerHTML, se estiver usando HTML
    }
  });
}
