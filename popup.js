document.getElementById("charForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const charName = document.getElementById("charName").value;
  const charHtml = document.getElementById("charHtml").value;
  const charSpeech = document.getElementById("charSpeech").value;

  if (!charName || !charHtml || !charSpeech) {
    alert("Preencha todos os campos antes de salvar!");
    return;
  }

  const charData = {
    charName: charName,
    html: charHtml,
    fala: charSpeech,
  };

  // Recuperar o cookie existente
  chrome.cookies.get(
    { url: window.location.hostname, name: "characterData" },
    function (cookie) {
      let characters = [];

      if (cookie) {
        // Se o cookie já existir, analise os dados
        characters = JSON.parse(cookie.value);
      }

      // Verificar se o personagem já existe
      const existingCharIndex = characters.findIndex(
        (char) => char.charName === charName
      );

      if (existingCharIndex > -1) {
        // Atualizar personagem existente
        characters[existingCharIndex] = charData;
        alert(`Personagem "${charName}" atualizado com sucesso!`);
      } else {
        // Adicionar novo personagem
        characters.push(charData);
        alert(`Personagem "${charName}" salvo com sucesso!`);
      }

      // Criar o novo cookie com o vetor atualizado
      const newCookieData = {
        url: window.location.hostname,
        name: "characterData",
        value: JSON.stringify(characters), // Salvar todos os personagens como string JSON
        expirationDate: Math.floor(Date.now() / 1000) + 3600, // 1 hora de expiração
      };

      // Salvar o novo cookie
      chrome.cookies.set(newCookieData, function (cookie) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert("Erro ao salvar personagem nos cookies.");
        } else {
          window.close(); // Fechar o popup após salvar
        }
      });
    }
  );
});
