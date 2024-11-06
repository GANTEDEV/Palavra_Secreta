const tiles = document.querySelector(".tile-container");
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThirdRow = document.querySelector("#keyboardThirdRow");

// Array com 10 palavras de 5 letras, usei CHAT-GPT para gerar as palavras
const palavras = ["CACHO", "PENAS", "TIGRE", "FALHA", "BOLHA", "MELAR", "LETRA", "PILHA", "REINO", "FOICE"];
const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

const rows = 6;
const columns = 5;
let currentRow = 0;
let currentColumn = 0;
let guesses = [];

for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  guesses[rowIndex] = new Array(columns);
  const tileRow = document.createElement("div");
  tileRow.setAttribute("id", "row" + rowIndex);
  tileRow.setAttribute("class", "tile-row");
  for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
    const tileColumn = document.createElement("div");
    tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
    tileColumn.setAttribute(
      "class",
      rowIndex === 0 ? "tile-column typing" : "tile-column disabled"
    );
    tileRow.append(tileColumn);
    guesses[rowIndex][columnIndex] = "";
  }
  tiles.append(tileRow);
}

const checkGuess = () => {
  const guess = guesses[currentRow].join("");
  if (guess.length !== columns) {
    return;
  }

  const currentColumns = document.querySelectorAll(".typing");
  const secretWordArray = palavraSecreta.split("");

  for (let index = 0; index < columns; index++) {
    const letter = guess[index];

    if (letter === secretWordArray[index]) {
      currentColumns[index].classList.add("right");
    }
    else if (secretWordArray.includes(letter)) {
      currentColumns[index].classList.add("displaced");
    }
    else {
      currentColumns[index].classList.add("wrong");
    }
  }
  if (guess === palavraSecreta) {
    window.alert("Parabéns! Você adivinhou a palavra secreta!");
    return;
  } else {
    if (currentRow === rows - 1) {
      window.alert("Você perdeu! A palavra secreta era: " + palavraSecreta);
    } else {
      moveToNextRow();
    }
  }
};

const moveToNextRow = () => {
  const typingColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < typingColumns.length; index++) {
    typingColumns[index].classList.remove("typing");
    typingColumns[index].classList.add("disabled");
  }

  currentRow++;
  currentColumn = 0;

  const currentRowEl = document.querySelector("#row" + currentRow);
  const currentColumns = currentRowEl.querySelectorAll(".tile-column");
  for (let index = 0; index < currentColumns.length; index++) {
    currentColumns[index].classList.remove("disabled");
    currentColumns[index].classList.add("typing");
  }
};

const handleKeyboardOnClick = (key) => {
  if (currentColumn === columns) {
    return;
  }

  const currentTile = document.querySelector("#row" + currentRow + "column" + currentColumn);
  currentTile.textContent = key;
  guesses[currentRow][currentColumn] = key;
  currentColumn++;
};

const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
    buttonElement.addEventListener("touchend", () => handleKeyboardOnClick(key)); // Adiciona detecção de toque
    keyboardRow.append(buttonElement);
  });
};

createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

const handleBackspace = () => {
  if (currentColumn === 0) {
    return;
  }

  currentColumn--;
  guesses[currentRow][currentColumn] = "";
  const tile = document.querySelector("#row" + currentRow + "column" + currentColumn);
  tile.textContent = "";
};

const backspaceButton = document.createElement("button");
backspaceButton.addEventListener("click", handleBackspace);
backspaceButton.addEventListener("touchend", handleBackspace); // Adiciona detecção de toque
backspaceButton.textContent = "<";
backspaceAndEnterRow.append(backspaceButton);

const enterButton = document.createElement("button");
enterButton.addEventListener("click", checkGuess);
enterButton.addEventListener("touchend", checkGuess); // Adiciona detecção de toque
enterButton.textContent = "Tentar";
backspaceAndEnterRow.append(enterButton);

document.onkeydown = function (evt) {
  evt = evt || window.evt;
  if (evt.key === "Bora!") {
    checkGuess();
  } else if (evt.key === "Backspace") {
    handleBackspace();
  } else if (evt.key.length === 1 && /[a-zA-Z]/.test(evt.key)) {
    handleKeyboardOnClick(evt.key.toUpperCase());
  }
};
