/*  Nombre: PIG GAME
*   Reglas:
*       - El juego es de 2 jugadores, jugando uno en cada turno.
*       - En cada turno, un jugador hace una tirada de dados tantas veces como desee. Las tiradas se van acumulando en la puntuación del round actual.
*       - Pero, si un jugador saca un 1, pierde todos sus puntos. Acto seguido, es el turno del siguiente jugador.
*       - El jugador puede pasar, guardando la puntuación del round en la puntuación global. Después de eso, es el turno del siguiente jugador.
*       - El primer jugador que alcance los 100 puntos gana la partida.
*
*   Especial:
*       - Si un jugador saca 2 veces seguidas un '6', se le borran todos los puntos acumulados hasta ahora. Acto seguido, es el turno del siguiente jugador.
*       - Introducir un campo de texto para poner un objetivo de puntuación: FT50, FT100...
*       - Añadir otro dado al juego.
**/

// Declaración de variables
var scores, roundScore, activePlayer, gamePlaying, lastDice;
init();

/*  Manipulación del DOM con función anónima (sin callback a otra función declarada), es un EventListener
*   que al hacer click con el ratón, lanza el siguiente código del evento - Documentación: https://developer.mozilla.org/en-US/docs/Web/Events
**/
document.querySelector('.btn-roll').addEventListener('click', function() {
    if(gamePlaying) {
        // 1. Tirada de dados
        var dice = Math.floor( Math.random() * 6 ) + 1; // Generamos aleatoriamente el resultado del dado. Math.floor() es para quitar los decimales.
        
        // 2. Mostrar por pantalla el resultado del dado lanzado
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        // 3. Actualizar la puntuación actual con la obtenida, si no ha salido un '1' o dos '6' seguidos en la tirada
        if (dice === 6 && lastDice === 6) {
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = 0;
            nextPlayer();
        } else if (dice !== 1) {
            // Añadir puntuación
            roundScore += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            // Siguiente jugador
            nextPlayer();
        }

        // 4. Almacenar último dado lanzado
        lastDice = dice;
    }
}); 

document.querySelector('.btn-hold').addEventListener('click', function() {
    if(gamePlaying) {
        // 1. Añadir la puntuación actual del round a la puntuación global del jugador
        scores[activePlayer] += roundScore;

        // 2. Actualizar la interfaz de usuario
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        // 3. Comprobar si hay puntuación máxima estableciada para ganar la partida
        var input = document.querySelector('.final-score').value;
        var winningScore;

        /*  Si se pasan los valores como Undefined, 0, "" or null se interpreta como false.
        *   En caso contrario, todo valor diferente a los anteriores es considerado como true.
        **/
        if (input) {
            winningScore = input;
        } else{
            winningScore = 100;
        }
        // 4. Comprobar si el jugador actual a ganado la partida
        if(scores[activePlayer] >= winningScore) {
            // Fin de la partida
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
            // La partida continua. Cambio de jugador.
            nextPlayer();
            document.querySelector('.dice').style.display = 'none'; // Dejamos de mostrar el dado
        }
    }
});

document.querySelector('.btn-new').addEventListener('click', init);

function nextPlayer() {
    lastDice = 0; // Reiniciamos el último dado a '0'
    roundScore = 0; // Reiniciamos la puntuación almacenada en la variable a '0'
    document.querySelector('#current-' + activePlayer).textContent = roundScore; // Reiniciamos a '0' el marcador en la pantalla
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0; // Operador ternario para cambiar la variable de un jugador a otro
    document.querySelector('.player-0-panel').classList.toggle('active'); // Alternamos el cambio de jugador a otro por pantalla con la clase 'active'
    document.querySelector('.player-1-panel').classList.toggle('active');

    //document.querySelector('.player-0-panel').classList.remove('active'); // Código de referencia
    //document.querySelector('.player-1-panel').classList.add('active');
}

function init() {
    scores = [0, 0]; // Array que almacena la puntuación de cada jugador
    roundScore = 0; // Variable que usamos contar la puntuación de cada round, independiente del jugador
    activePlayer = 0; // Especifica el jugador activo en el round actual - [0]: primerjugador, [1]: segundo jugador.
    gamePlaying = true;
    lastDice = 0;

    // Ocultamos el dado con display: none
    document.querySelector('.dice').style.display = 'none'; 

    // Reinicializamos todos los valores del DOM a '0'
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'player 1';
    document.getElementById('name-1').textContent = 'player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.final-score').value = '';
}



/*  Ejemplo de cómo podemos manipular el DOM para cambiar el número de la puntuación del round con la id #current-x. Para ello,
*   concatenaremos la string '#current-' y la juntamos con el valor actual que tenga activePlayer ('0' o '1'). De esta forma,
*   añadirá el resultado que haya salido del dado a la puntuación del jugador.
**/
//activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
//document.querySelector('#current-' + activePlayer).textContent = dice;