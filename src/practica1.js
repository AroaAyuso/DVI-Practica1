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
    this.cartas = new Array(16);
    this.cartaActual = null;
    this.continua = false;
    this.numparejas = 0;

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
        //this.gs.drawMessage("Mensajeeeeeeeeeeeeeeeeeee"); ///////////////////////////////
        for (var i = 0; i < 16; i++){
            this.cartas[i].draw(this.gs, i);
        }
    }

    //llama a draw cada 16ms
    this.loop = function(){
        setInterval(this.draw.bind(this),16);
    }

    // Se le llama cada vez que se pulsa en el tablero, se encarga de dar la vuelta a la carta y si hay dos boca arriba 
    // comprobar si son la misma, en caso de no serlo hay que girarlas otra vez
    this.onClick = function(cardId){
        // Funciones que tenemos:
        // this.draw = function(tile, boardPos) -- dibuja una carta
        // this.resolveCard = function(x,y) -- convierte una posición del canvas en la de una carta
        // this.drawMessage = function(message) -- escribe un mensaje
        // var InputServer = function() -- llama a este metodo.

        while(continua){
            this.cartas[cardId].flip();
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

    this.flip = function(){
        if (this.estadoarriba) this.estadoarriba = 0;
        else this.estadoarriba = 1;
    }

    this.found = function(){
        this.estadoarriba = 1;
        this.estadoencontrada = 1;
    }

    this.compareTo = function(otherCard){
        return this.sprite == otherCard;
    }

    this.draw = function(gs, pos){
        if (this.estadoarriba) gs.draw(this.sprite,pos);
        else gs.draw("back", pos);
    }

};
