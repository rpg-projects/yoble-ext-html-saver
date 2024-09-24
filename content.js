// Adiciona o botão "Adicionar HTML" ao container
const buttonContainer = document.querySelector(".col-md-12");
const submitButton = buttonContainer.querySelector(".btn-success");

if (buttonContainer) {
  buttonContainer.style.marginBottom = "40px";

  const addButton = document.createElement("button");
  addButton.innerText = "Adicionar HTML";
  addButton.classList.add("btn", "btn-default", "btn-primary");
  addButton.style.marginLeft = "5px"; // Espaçamento

  // Impede a ação do botão de sucesso
  addButton.onclick = function (event) {
    event.preventDefault(); // Impede o comportamento padrão
    event.stopPropagation(); // Para evitar que o clique propague para o botão de submit
    openFakePopup(); // Ao clicar, abre o popup
  };

  // Adiciona o botão após o botão de submit
  submitButton.insertAdjacentElement("afterend", addButton);

  // Verifica se há personagens e cria o botão "Menu de Chars"
  if (getCharacters().length > 0) {
    createMenuButton();
  }
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

  // Preenche os campos se for uma edição
  if (charData.charName) {
    document.getElementById("charName").value = charData.charName;
    document.getElementById("charHtml").value = charData.html;
    document.getElementById("charSpeech").value = charData.fala;
  }

  // Event Listeners
  document.getElementById("saveChar").onclick = saveCharacter;
  document.getElementById("closePopup").onclick = () => {
    document.body.removeChild(popupContainer);
  };
}

// Função para salvar o personagem
function saveCharacter() {
  const charName = document.getElementById("charName").value.trim();
  const charHtml = document.getElementById("charHtml").value.trim();
  const charSpeech = document.getElementById("charSpeech").value.trim();

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

  // Salvar no localStorage
  const characters = getCharacters();
  const existingCharIndex = characters.findIndex(
    (c) => c.charName === charName
  );

  const charData = { charName, html: charHtml, fala: charSpeech };

  if (existingCharIndex > -1) {
    characters[existingCharIndex] = charData; // Atualiza se já existir
  } else {
    characters.push(charData); // Adiciona novo personagem
  }

  localStorage.setItem("characters", JSON.stringify(characters));
  alert("Personagem salvo com sucesso!");

  // Atualiza o menu de chars se necessário
  if (characters.length === 1) {
    createMenuButton();
  }

  // Fecha o popup
  document.getElementById("popupContainer").remove();
}

// Função para criar o botão "Menu de Chars"
function createMenuButton() {
  const menuButton = document.createElement("button");
  menuButton.innerText = "Menu de Chars";
  menuButton.classList.add("btn", "btn-default", "btn-info");
  menuButton.style.marginLeft = "5px"; // Espaçamento
  menuButton.onclick = toggleCharacterMenu;

  const toolbar = document.querySelector(".note-toolbar.panel-heading");
  toolbar.appendChild(menuButton);
}

// Função para alternar o menu de personagens
function toggleCharacterMenu() {
  let charMenu = document.getElementById("charMenu");

  if (!charMenu) {
    charMenu = document.createElement("div");
    charMenu.id = "charMenu";
    charMenu.style.position = "absolute";
    charMenu.style.backgroundColor = "#f9f9f9";
    charMenu.style.border = "1px solid #ccc";
    charMenu.style.padding = "10px";
    charMenu.style.zIndex = "1000";

    const characters = getCharacters();
    characters.forEach((char) => {
      const charItem = document.createElement("div");
      charItem.innerText = char.charName;
      charItem.style.marginBottom = "5px";

      const editButton = document.createElement("button");
      editButton.innerText = "Editar";
      editButton.onclick = () => {
        openFakePopup(char);
        document.body.removeChild(charMenu); // Fecha o menu
      };

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Deletar";
      deleteButton.onclick = () => {
        deleteCharacter(char.charName);
        document.body.removeChild(charMenu); // Fecha o menu
      };

      charItem.appendChild(editButton);
      charItem.appendChild(deleteButton);
      charMenu.appendChild(charItem);
    });

    document.body.appendChild(charMenu);
  } else {
    document.body.removeChild(charMenu); // Fecha o menu se já estiver aberto
  }
}

// Função para deletar um personagem
function deleteCharacter(charName) {
  let characters = getCharacters();
  characters = characters.filter((c) => c.charName !== charName);
  localStorage.setItem("characters", JSON.stringify(characters));
  alert("Personagem deletado.");
}

// Função para obter personagens do localStorage
function getCharacters() {
  return JSON.parse(localStorage.getItem("characters")) || [];
}
