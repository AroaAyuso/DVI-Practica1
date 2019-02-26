/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
    this.gs = gs;
    this.mensaje = "Memory Game";
    this.cartas = new Array(16);
    this.cartalevantada = null; // carta que acabamos de levantar en caso de no haber ninguna levantada o la que ya estaba levantada al levantar la actual
    this.numCartas = 0; // Número de cartas levantadas en el momnto actual
    this.numparejas = 0; // número de parejas encontradas

    //inicializa el juego creando las cartas, las desordena y comieza el bucle del juego
    this.initGame = function(){

        var nom_Cartas = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];
        
        for (var i = 0; i < 16; i+=2){
            this.cartas[i] = new MemoryGameCard(nom_Cartas[i%8]);
            this.cartas[i+1] = new MemoryGameCard(nom_Cartas[(i+1)%8]);
        }

        this.mezclarCartas(this.cartas);

        this.loop();
    }

    // mezcla las cartas seleccionando aleatoriamente la posicion destino,
    // el *16 significa que coge números de 0 al 15 -> (max - min) + min, el max se excluye
    this.mezclarCartas = function(cartas){
        var cartasaux = new Array(16);
        var i = 0;
        while (i < 16){
            var pos = Math.floor(Math.random() * 16);
            if ((pos in cartasaux)==false) {
                cartasaux[pos] = this.cartas[i];
                ++i;
            }
        }
        this.cartas = cartasaux;
    }

    // escribe el mensaje con el estado actual, pide a las cartas que se dibujen
    this.draw = function(){
        this.gs.drawMessage(this.mensaje);
        for (var i = 0; i < 16; i++){
            this.cartas[i].draw(this.gs, i);
        }
    }

    //llama a draw cada 16ms
    this.loop = function(){
       setInterval(this.draw.bind(this),16);
    }

    // Se le llama cada vez que se pulsa en el tablero, se encarga de dar la vuelta a la carta 
    //y si hay dos boca arriba comprueba si son la misma, en caso de no serlo hay que girarlas otra vez
    this.onClick = function(cardId){
        
        if (cardId >= 0 && cardId != null && cardId <= 15){
            if (this.numparejas == 8) {
                this.mensaje = "Refresh to continue";
            }
            else{
                if (this.numCartas == 0){
                    this.cartas[cardId].flip(); // Da la vuelta a la carta
                    this.cartalevantada = cardId; // guarda su identificador
                    this.numCartas++; // Indica que hay una carta levantada
                }
                else if (this.numCartas == 1){
                    if (this.cartas[cardId].getestado() == 0){
                        //this.cartas[cardId].flip(); // Da la vuelta a la carta
                        if (this.cartas[cardId].compareTo(this.cartas[this.cartalevantada].getId())){ // Compara los sprites
                            this.cartas[cardId].found();
                            this.cartas[this.cartalevantada].found();
                            ++this.numparejas;
                            this.mensaje = "Match Found!";
                            this.numCartas = 0;
                            if (this.numparejas == 8) this.mensaje = "You Win!";
                        }
                        else{
                            this.mensaje = "Try Again";
                            this.cartas[cardId].flip();
                            
                            // hacemos una copia de la primera carta levantada y de la clase 
                            var primeraCarta = this.cartalevantada
                            var that = this;
                            ++this.numCartas;
                            
                            // programamos que se den la vuelta en 1 segundo
                            setTimeout(function(){
                                that.cartas[primeraCarta].flip();
                                that.cartas[cardId].flip();
                                that.numCartas=0;},1000);
                        }
                    }
                    this.cartalevantada = null;
                }
            }
        }

    }

};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} sprite Nombre del sprite que representa la carta
 */
MemoryGameCard = function(sprite) {
    this.sprite = sprite;
    this.estadoarriba = 0;
    this.estadoencontrada = 0;

    // Da la vuelta a la carta
    this.flip = function(){
        if (this.estadoarriba == 1) this.estadoarriba = 0;
        else this.estadoarriba = 1;
    }

        // marca si la carta ha sido encontrada
    this.found = function(){
        this.estadoarriba = 1;
        this.estadoencontrada = 1;
    }

    // compara la carta con otra
    this.compareTo = function(otherCard){
        return this.sprite == otherCard;
    }

    // Dibuja la carta 
    this.draw = function(gs, pos){
        if (this.estadoarriba) gs.draw(this.sprite,pos);
        else gs.draw("back", pos);
    }

    // Devuelve el estado de la carta
    this.getestado = function(){
        return this.estadoarriba;
    }

    // Devuelve el sprite de la carta
    this.getId = function(){
        return this.sprite;
    }

};
