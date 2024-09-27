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
  dropdownMenu.style.width = "200px";

  dropdownMenu.style.marginTop = "-180%";
  dropdownMenu.style.marginLeft = "-250%";

  // Add the button and menu to the dropdown container
  dropdownContainer.appendChild(menuButton);
  dropdownContainer.appendChild(dropdownMenu);

  // Add the dropdown after the "Adicionar HTML" button
  addButton.insertAdjacentElement("afterend", dropdownContainer);

  // Populate the dropdown with saved characters (if needed)
  const characters = getCharacters(); // Assuming getCharacters() is already defined
  characters.forEach((char) => {
    const charItem = document.createElement("li");
    charItem.style.display = "flex";
    charItem.style.marginBottom = "5px";

    const charLink = document.createElement("a");
    charLink.href = "#";
    charLink.innerText = char.charName;
    charLink.style.display = "block";

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

    // Append the link and buttons to the list item
    charItem.appendChild(charLink);
    charItem.appendChild(editButton);
    charItem.appendChild(deleteButton);

    // Add the list item to the dropdown menu
    dropdownMenu.appendChild(charItem);
  });
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
    characters.forEach((char) => {
      console.log("char :>> ", char.charName);
      const charItem = document.createElement("li");
      charItem.style.marginBottom = "5px";

      const charLink = document.createElement("a");
      charLink.href = "#";
      charLink.innerText = char.charName;
      charLink.style.display = "block";

      // Botão de editar personagem
      const editButton = document.createElement("button");
      editButton.innerHTML = `<i class="fa fa-edit"></i>`;
      editButton.classList.add("btn", "btn-warning", "btn-sm");
      editButton.style.marginRight = "5px";
      editButton.onclick = (event) => {
        event.preventDefault(); // Impede o comportamento padrão
        event.stopPropagation(); // Para evitar que o clique propague para o botão de submit

        openFakePopup(char); // Abre o popup de edição
      };

      // Botão de deletar personagem
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.onclick = (event) => {
        event.preventDefault(); // Impede o comportamento padrão
        event.stopPropagation(); // Para evitar que o clique propague para o botão de submit

        deleteCharacter(char.id); // Deleta o personagem
        loadCharacterDropdown(dropdownMenu); // Recarrega a lista de personagens
      };

      // Adiciona o link e os botões no item do menu
      charItem.appendChild(charLink);
      charItem.appendChild(editButton);
      charItem.appendChild(deleteButton);
      dropdownMenu.appendChild(charItem);
    });
  }
}

// Função para deletar um personagem
function deleteCharacter(id) {
  let characters = getCharacters();
  characters = characters.filter((char) => char.id !== id);
  localStorage.setItem("characters", JSON.stringify(characters));
  // alert("Personagem deletado.");
}

const textBox = document.querySelector(".note-editable.panel-body");
if (textBox) {
  textBox.addEventListener("input", function () {
    localStorage.setItem("userText", textBox.innerHTML);
  });

  window.addEventListener("load", () => {
    const savedContent = localStorage.getItem("userText");
    if (textBox && savedContent) {
      textBox.innerText = savedContent; // Ou innerHTML, se estiver usando HTML
    }
  });
}
