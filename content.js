chrome.cookies.get(
  { url: window.location.hostname, name: "characterData" },
  function (cookie) {
    if (cookie) {
      const characters = JSON.parse(cookie.value);
      console.log("Dados recuperados dos cookies:", characters);

      // Você pode iterar sobre os personagens e usar os dados conforme necessário
      characters.forEach((char) => {
        console.log(
          `Nome: ${char.charName}, HTML: ${char.html}, Fala: ${char.fala}`
        );
      });
    } else {
      console.log("Nenhum cookie encontrado.");
    }
  }
);

// Selecionar o contêiner que contém o botão "Responder"
const buttonContainer = document.querySelector(".col-md-12");

// Verificar se o contêiner existe
if (buttonContainer) {
  //Espaço abaixo dos botões
  buttonContainer.style.marginBottom = "40px";

  // Criar o botão "Adicionar HTML"
  const addButton = document.createElement("button");
  addButton.innerText = "Adicionar HTML";
  addButton.classList.add("btn", "btn-default", "btn-primary");
  addButton.style.marginLeft = "5px"; // Espaçamento
  addButton.onclick = openPopup;

  // Inserir o botão "Adicionar HTML" ao lado do botão "Responder"
  const submitButton = buttonContainer.querySelector(".btn-success");
  if (submitButton) {
    submitButton.insertAdjacentElement("afterend", addButton);
  }

  // Função para verificar se há personagens no localStorage
  function hasCharacters() {
    const characters = JSON.parse(localStorage.getItem("characters")) || [];

    return characters.length > 0;
  }

  // Verificar se há personagens e, se houver, criar o botão "Menu de Personagens"
  if (hasCharacters()) {
    // Criar o botão "Menu de Personagens"
    const menuButton = document.createElement("button");
    menuButton.innerText = "Menu de Personagens";
    menuButton.classList.add("btn", "btn-default", "btn-info");
    menuButton.style.marginLeft = "5px"; // Espaçamento entre os botões
    menuButton.onclick = toggleCharacterMenu;

    // Inserir o botão "Menu de Personagens" ao lado do botão "Adicionar HTML"
    addButton.insertAdjacentElement("afterend", menuButton);

    // Criar o menu de personagens (inicialmente oculto)
    const charMenu = document.createElement("div");
    charMenu.classList.add("character-menu");
    charMenu.style.display = "none"; // Esconder o menu inicialmente
    charMenu.style.marginTop = "10px";
    charMenu.style.border = "1px solid #ccc";
    charMenu.style.padding = "10px";
    charMenu.style.backgroundColor = "#f9f9f9";

    // Adicionar o menu ao contêiner de botões
    buttonContainer.appendChild(charMenu);

    // Função para popular o menu de personagens
    function populateCharacterMenu() {
      charMenu.innerHTML = ""; // Limpar o menu
      const characters = JSON.parse(localStorage.getItem("characters")) || [];

      if (characters.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "Nenhum personagem adicionado.";
        charMenu.appendChild(emptyMessage);
      } else {
        characters.forEach((char) => {
          const charItem = document.createElement("div");
          charItem.style.marginBottom = "10px";

          const charName = document.createElement("span");
          charName.innerText = char.char;

          const editIcon = document.createElement("button");
          editIcon.innerText = "✏️";
          editIcon.style.marginLeft = "10px";
          editIcon.onclick = () => editCharacter(char.char);

          const deleteIcon = document.createElement("button");
          deleteIcon.innerText = "🗑️";
          deleteIcon.style.marginLeft = "5px";
          deleteIcon.onclick = () => deleteCharacter(char.char);

          charItem.appendChild(charName);
          charItem.appendChild(editIcon);
          charItem.appendChild(deleteIcon);

          charMenu.appendChild(charItem);
        });
      }
    }

    // Função para alternar o menu de personagens
    function toggleCharacterMenu() {
      if (charMenu.style.display === "none") {
        populateCharacterMenu();
        charMenu.style.display = "block";
      } else {
        charMenu.style.display = "none";
      }
    }

    // Função para editar um personagem
    function editCharacter(charName) {
      const characters = JSON.parse(localStorage.getItem("characters")) || [];
      const char = characters.find((c) => c.char === charName);
      if (char) {
        document.getElementById("charName").value = char.charName;
        document.getElementById("charHtml").value = char.html;
        document.getElementById("charSpeech").value = char.fala;
      }
      openPopup(); // Abrir o popup de edição
    }

    // Função para deletar um personagem
    function deleteCharacter(charName) {
      let characters = JSON.parse(localStorage.getItem("characters")) || [];
      characters = characters.filter((c) => c.char !== charName);
      localStorage.setItem("characters", JSON.stringify(characters));
      alert("Personagem removido.");
      populateCharacterMenu(); // Atualizar o menu
    }
  }
}

// Função para abrir o popup da extensão
function openPopup() {
  chrome.runtime.sendMessage({ action: "openPopup" });
}

// Salvar o conteúdo da área de texto (narrativa) automaticamente
const textBox = document.querySelector(".note-editable.panel-body");
if (textBox) {
  textBox.addEventListener("input", function () {
    localStorage.setItem("userText", textBox.innerHTML);
  });
  // Restaurar o texto salvo se o usuário recarregar a página
  const savedText = localStorage.getItem("userText");
  if (savedText) {
    textBox.innerHTML = savedText;
  }
}
