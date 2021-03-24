class PreguntaEvaluacionP {
    constructor(cartel, pregunta) {
        this.cartel = cartel;
        this.pregunta = pregunta;

        let titulo = document.createElement('h4');
        titulo.className = 'tituloE';
        titulo.innerHTML = this.pregunta.titulo;

        let rubrica = document.createElement('h4');
        rubrica.className = 'rubrica';
        rubrica.innerHTML = this.pregunta.rubrica;

        var puntos = pregunta.rubrica.split(':');

        this.button1 = document.createElement('button');
        this.button1.className = 'botonCalificacion';
        this.button1.innerHTML = "0" + (puntos[1].split(',')[0]);

        this.button2 = document.createElement('button');
        this.button2.className = 'botonCalificacion';
        this.button2.innerHTML = "1" + (puntos[2].split(',')[0])

        this.button3 = document.createElement('button');
        this.button3.className = 'botonCalificacion';
        this.button3.innerHTML = "2" + (puntos[3].split(',')[0])

        this.button4 = document.createElement('button');
        this.button4.className = 'botonCalificacion';
        this.button4.innerHTML = "3" + (puntos[4].split('.')[0])

        this.div = document.createElement('div');
        this.div.className = "divPregunta";

        this.div.appendChild(titulo);
        this.div.appendChild(rubrica);
        this.div.appendChild(this.button1);
        this.div.appendChild(this.button2);
        this.div.appendChild(this.button3);
        this.div.appendChild(this.button4);
    }
}