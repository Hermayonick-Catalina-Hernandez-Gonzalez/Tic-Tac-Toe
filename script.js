let currentPlayer = "X";
let cells = document.querySelectorAll(".cell");
let gameEnded = false;
var tiempos = true;
h = 0;
m = 0;
s = 0;
var times
var hAux, mAux, sAux;

function Tiempo(){
    
    s++;
    if (s>99){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>10){h=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}
    
    document.getElementById("timer").innerHTML = "Tiempo: " + hAux + ":" + mAux + ":" + sAux; 
}

function iniciar(){
  if(tiempos){
    Tiempo()
    times = setInterval(Tiempo, 10);
  }
  tiempos = false;
}

function parar(){
    clearInterval(times);
}

function removeItem(){
    var items = document.querySelectorAll('#scores li');
    for(i = 0; i < items.length; i++) {
      items[i].parentNode.removeChild(items[i]);
    }
}

function LlenarTablero() {
  removeItem();

  let puntajesGuardadosJson = localStorage.getItem("puntajes");
  let puntajesGuardados = JSON.parse(puntajesGuardadosJson);

  puntajesGuardados.sort((a, b) => {
    // Ordenar por tiempo (de menor a mayor)
    return a.scores.localeCompare(b.scores);
  });

  puntajesGuardados.forEach(i => {
    var x = document.createElement("LI");
    var t = document.createTextNode(i.username + " - " + i.scores);
    x.appendChild(t);
    document.getElementById("scores").appendChild(x);
  });
}

if(localStorage.getItem("puntajes")){
  LlenarTablero();
}

function cellClick(cellIndex) {
  if (cells[cellIndex].innerText === "" && !gameEnded) {
    cells[cellIndex].innerText = currentPlayer;
    if (checkWin()) {
      parar()
      
      let nombre = prompt("Ha ganado "+currentPlayer+", ingrese su nombre: ");

      puntaje = []

      if(localStorage.getItem("puntajes")){
        let puntajesGuardadosJson = localStorage.getItem("puntajes");
          let puntajesGuardados = JSON.parse(puntajesGuardadosJson);
          puntaje = puntajesGuardados;
      }
      
      var tiempo_final = hAux + ":" + mAux + ":" + sAux;
      puntaje.push({"username": nombre, "scores": tiempo_final})

      let puntajesJson = JSON.stringify(puntaje);
          localStorage.setItem("puntajes", puntajesJson);
          LlenarTablero()

      gameEnded = true;
    } else if (checkDraw()) {
      alert("¡Empate!");
      gameEnded = true;
    } else {
      iniciar();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
   
    if(currentPlayer === "O"){
      CPU()
    }
  
  }  
}

function CPU() {
  var posicion = 0;
  var breaks = true;
  while(breaks){
    posicion = parseInt((Math.random() * (9 - 1) + 1), 10);
    if(cells[posicion-1].innerText === ""){
      breaks = false;
    }
  }
  cellClick(posicion-1);
}

function checkWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winConditions.some(condition =>
    cells[condition[0]].innerText !== "" &&
    cells[condition[0]].innerText === cells[condition[1]].innerText &&
    cells[condition[0]].innerText === cells[condition[2]].innerText
  );
}

function checkDraw() {
  return Array.from(cells).every(cell => cell.innerText !== "");
}
function resetGame() {
  // Reiniciar variables y contenido del juego
  currentPlayer = "X";
  gameEnded = false;
  tiempos = true;
  h = 0;
  m = 0;
  s = 0;
  clearInterval(times);

  // Limpiar contenido de las celdas
  cells.forEach(cell => {
    cell.innerText = "";
  });

  // Reiniciar el tiempo
  document.getElementById("timer").innerHTML = "Tiempo: 00:00:00";

  // Iniciar nuevo juego
  iniciar();
}

function resetScores() {
  // Borra todas las puntuaciones almacenadas
  localStorage.removeItem("puntajes");

  // Elimina los elementos de la lista de puntuaciones
  removeItem();

  // Informa al usuario que las puntuaciones se han reiniciado
  alert("Puntuaciones reiniciadas");

  // Vuelve a llenar el tablero (vaciado por removeItem)
  LlenarTablero();
}