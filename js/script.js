const tamañoTablero = 8;
const tamañosBarcos = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let tablero = [];
let movimientosRestantes = 32;
let barcosDerribados = 0;
let barcos = [];

function inicializarTablero() {
  tablero = Array(tamañoTablero * tamañoTablero).fill(null);
}

function colocarBarcos() {
  barcos = [];
  tamañosBarcos.forEach(tamaño => {
    let colocado = false;
    while (!colocado) {
      const orientacion = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const posicionInicial = Math.floor(Math.random() * tamañoTablero * tamañoTablero);
      const posicionesBarco = intentarColocarBarco(posicionInicial, tamaño, orientacion);
      if (posicionesBarco.length === tamaño) {
        const libre = posicionesBarco.every(pos => tablero[pos] === null) &&
                      posicionesBarco.every(pos => !tieneBarcoCercano(pos));
        if (libre) {
          posicionesBarco.forEach(pos => tablero[pos] = 'barco');
          barcos.push({ posiciones: posicionesBarco, derribado: false });
          colocado = true;
        }
      }
    }
  });
  renderizarMapaBarcos(); // Renderizar el mini-mapa después de colocar los barcos
}

function intentarColocarBarco(posicion, tamaño, orientacion) {
  const posiciones = [];
  const fila = Math.floor(posicion / tamañoTablero);
  const columna = posicion % tamañoTablero;

  for (let i = 0; i < tamaño; i++) {
    if (orientacion === 'horizontal') {
      const nuevaColumna = columna + i;
      if (nuevaColumna >= tamañoTablero) return [];
      posiciones.push(fila * tamañoTablero + nuevaColumna);
    } else {
      const nuevaFila = fila + i;
      if (nuevaFila >= tamañoTablero) return [];
      posiciones.push(nuevaFila * tamañoTablero + columna);
    }
  }

  return posiciones;
}

function tieneBarcoCercano(indice) {
  const fila = Math.floor(indice / tamañoTablero);
  const columna = indice % tamañoTablero;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const filaVerificar = fila + i;
      const columnaVerificar = columna + j;
      if (filaVerificar >= 0 && filaVerificar < tamañoTablero &&
          columnaVerificar >= 0 && columnaVerificar < tamañoTablero) {
        const indiceVerificar = filaVerificar * tamañoTablero + columnaVerificar;
        if (tablero[indiceVerificar] === 'barco') return true;
      }
    }
  }
  return false;
}

function renderizarTablero() {
  const tableroDiv = document.getElementById('tablero');
  tableroDiv.innerHTML = '';
  for (let i = 0; i < tamañoTablero * tamañoTablero; i++) {
    const casilla = document.createElement('button');
    casilla.classList.add('tile');
    casilla.dataset.indice = i;
    casilla.addEventListener('click', manejarClic);
    tableroDiv.appendChild(casilla);
  }
}

function renderizarMapaBarcos() {
  const mapaDiv = document.getElementById('mapaBarcos');
  mapaDiv.innerHTML = '';

  for (let i = 0; i < tamañoTablero * tamañoTablero; i++) {
    const celda = document.createElement('div');
    celda.style.width = '100%';
    celda.style.height = '100%';

    if (tablero[i] === 'barco') {
      celda.style.backgroundColor = '#ff0000'; // Color para barcos
    } else {
      celda.style.backgroundColor = '#666'; // Color para celdas vacías
    }

    mapaDiv.appendChild(celda);
  }
}

function actualizarUI() {
  document.getElementById('movimientos').innerText = `Movimientos restantes: ${movimientosRestantes}`;
  document.getElementById('estado').innerText = `Barcos derribados: ${barcosDerribados} / ${tamañosBarcos.length}`;
}

function manejarClic(evento) {
  const indice = parseInt(evento.target.dataset.indice);

  if (tablero[indice] === 'golpeado' || tablero[indice] === 'fallo') {
    return;
  }

  if (tablero[indice] === 'barco') {
    evento.target.classList.add('hit');
    tablero[indice] = 'golpeado';
    verificarBarcoDerribado(indice);
  } else {
    evento.target.classList.add('miss');
    tablero[indice] = 'fallo';
  }

  movimientosRestantes--;
  actualizarUI();
  verificarFinJuego();
}

function verificarBarcoDerribado(indiceGolpeado) {
  const barco = barcos.find(b => b.posiciones.includes(indiceGolpeado));
  if (barco) {
    const derribado = barco.posiciones.every(pos => tablero[pos] === 'golpeado');
    if (derribado && !barco.derribado) {
      barcosDerribados++;
      barco.derribado = true;
    }
  }
}

function verificarFinJuego() {
  if (barcosDerribados === tamañosBarcos.length) {
    alert('¡Felicidades! Has derribado todos los barcos.');
    reiniciarJuego();
  } else if (movimientosRestantes === 0) {
    alert('¡Fin del juego! Te has quedado sin movimientos.');
    reiniciarJuego();
  }
}

function reiniciarJuego() {
  movimientosRestantes = 32;
  barcosDerribados = 0;
  inicializarTablero();
  colocarBarcos();
  renderizarTablero();
  actualizarUI();
}

document.getElementById('botonIniciar').addEventListener('click', reiniciarJuego);
reiniciarJuego();
