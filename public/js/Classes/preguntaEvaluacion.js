class PreguntaEvaluacion {
    constructor(cartel, pregunta) {
        this.cartel = cartel;
        this.pregunta = pregunta;

        let titulo = document.createElement('h4');
        titulo.className = 'tituloE';
        titulo.innerHTML = this.pregunta.titulo;

        let rubrica = document.createElement('h4');
        rubrica.className = 'rubrica';
        rubrica.innerHTML = this.pregunta.rubrica;

        if (pregunta.titulo == "CARTEL EN INGLÉS" || pregunta.titulo == "GRAMATICA") {
            this.button1 = document.createElement('button');
            this.button1.className = 'botonCalificacion';
            this.button1.innerHTML = "No";

            this.button2 = document.createElement('button');
            this.button2.className = 'botonCalificacion';
            this.button2.innerHTML = "Si";
        }
        else{
            this.button1 = document.createElement('button');
            this.button1.className = 'botonCalificacion';
            this.button1.innerHTML = "0 No cumple";
    
            this.button2 = document.createElement('button');
            this.button2.className = 'botonCalificacion';
            this.button2.innerHTML = "1 Cumple Parcialmente";
    
            this.button3 = document.createElement('button');
            this.button3.className = 'botonCalificacion';
            this.button3.innerHTML = "2 CumpleTotalmente";
        }

        this.div = document.createElement('div');
        this.div.className = "divPregunta";

        this.div.appendChild(titulo);
        this.div.appendChild(rubrica);
        this.div.appendChild(this.button1);
        this.div.appendChild(this.button2);
        if(this.button3 != undefined)this.div.appendChild(this.button3);
        //let row = document.createElement('')
    }
}

class PreguntaEvaluacionIngles {

    constructor(cartel, preguntaIngles, preguntaGramatica){
        this.cartel = cartel;
        this.preguntaGramatica = preguntaGramatica;
        this.preguntaIngles = preguntaIngles;
        this.preguntaE2 = new PreguntaEvaluacion(cartel, preguntaGramatica);
        this.preguntaE1 = new PreguntaEvaluacion(cartel, preguntaIngles);
        
    }
}