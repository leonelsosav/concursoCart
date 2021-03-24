var firestore = firebase.firestore();
var idCartelSeleccionado = localStorage.getItem('idCartelSeleccionado');
var divContenido = document.getElementById("contenido");
var divContenidoIngles = document.getElementById("contenidoIngles");
var preguntasEvaluaciones = [];
var preguntasIngles;
var titulosEvaluados = [];
var puntosObtenidos = [];
var cartel;
var driver;
var sumaPuntos = 0;
var puntosH3 = document.getElementById("puntos");

function sesion(){
    if (localStorage.getItem("Usuario") == "" || localStorage.getItem("Usuario") == null) window.location.href = "index.html";
    else cargarInfo();
}

function cerrarSesion(){
    localStorage.setItem("Usuario", "");
    localStorage.setItem("Puesto", "");
    window.location.href = "index.html";
}

function cargarInfo() {
    puesto();
    document.getElementById('menu').addEventListener('click', () => {
        sidenav.classList.toggle("show");
    });
    driver = new DBDriver(firestore);
    driver.read("cartel", idCartelSeleccionado).then((value) => {
        cartel = new Cartel(value.clave, value.titulo, value.autor, value.juez, value.tipo, value.link);
        driver.readWhereWhereOrder("pregunta", "criterio", "==", "Forma", "tipo", "==", cartel.tipo, "Id", "asc").then((resultData) => {
            let preguntaIngles;
            let preguntaGramatica;
            resultData.forEach((element) => {
                let pregunta = new Pregunta(element.id, element.titulo, element.rubrica, element.criterio, element.tipo);
                if (pregunta.titulo == "CARTEL EN INGLÉS") preguntaIngles = pregunta;
                else if (pregunta.titulo == "GRAMATICA") preguntaGramatica = pregunta;
                else {
                    let preguntaEvaluacion = new PreguntaEvaluacion(cartel, pregunta);
                    divContenido.appendChild(preguntaEvaluacion.div);
                    preguntasEvaluaciones.push(preguntaEvaluacion);
                }
            });
            preguntasIngles = new PreguntaEvaluacionIngles(cartel, preguntaIngles, preguntaGramatica);
            divContenidoIngles.appendChild(preguntasIngles.preguntaE1.div);
            divContenidoIngles.appendChild(preguntasIngles.preguntaE2.div);
            divContenido.appendChild(document.createElement('br'));
            divContenido.appendChild(document.createElement('br'));
            let Data = { "clave": idCartelSeleccionado, "titulosF": titulosEvaluados, "puntosF": puntosObtenidos, "totalPuntosF": sumaPuntos, "evaluado": false };
            driver.read("evaluacion", idCartelSeleccionado).then((value) => {
                if (value.clave == undefined) {
                    driver.create("evaluacion", idCartelSeleccionado, Data).then((valueC) => {
                        toggleIngles();
                    });
                } else {
                    titulosEvaluados = value.titulosF;
                    puntosObtenidos = value.puntosF;
                    sumaPuntos = value.totalPuntosF;
                    toggleIngles();
                    puntosH3.innerHTML = "Total de puntos: " + sumaPuntos;
                    for (let i = 0; i < titulosEvaluados.length; i++) {
                        if (titulosEvaluados[i] == "CARTEL EN INGLÉS") {
                            if (puntosObtenidos[i] == 0) preguntasIngles.preguntaE1.button1.className = "seleccionado";
                            else preguntasIngles.preguntaE1.button2.className = "seleccionado";
                        }
                        else if (titulosEvaluados[i] == "GRAMATICA") {
                            if (puntosObtenidos[i] == 0) preguntasIngles.preguntaE2.button1.className = "seleccionado";
                            else preguntasIngles.preguntaE2.button2.className = "seleccionado";
                        }
                        else {
                            let res = preguntasEvaluaciones.find((o) => o.pregunta.titulo == titulosEvaluados[i]);
                            if (puntosObtenidos[i] == 0) res.button1.className = "seleccionado";
                            else if (puntosObtenidos[i] == 1) res.button2.className = "seleccionado";
                            else res.button3.className = "seleccionado";
                        }
                    }
                }
                listenersBotones();
            });
        });
    });
}

function listenersBotones() {
    preguntasEvaluaciones.forEach((element) => {
        element.button1.addEventListener('click', () => {
            restarPuntos(element);
            guardarPuntos(element.pregunta.titulo, 0);
            toggleIngles();
            mostrarPuntos().then((r) => {
                element.button1.className = "seleccionado";
                element.button2.className = "botonCalificacion";
                element.button3.className = "botonCalificacion";
            });
        });
        element.button2.addEventListener('click', () => {
            restarPuntos(element);
            sumaPuntos++;
            guardarPuntos(element.pregunta.titulo, 1);
            toggleIngles();
            mostrarPuntos().then((r) => {
                element.button1.className = "botonCalificacion";
                element.button2.className = "seleccionado";
                element.button3.className = "botonCalificacion";
            });
        });
        element.button3.addEventListener('click', () => {
            restarPuntos(element);
            sumaPuntos += 2;
            guardarPuntos(element.pregunta.titulo, 2);
            toggleIngles();
            mostrarPuntos().then((r) => {
                element.button1.className = "botonCalificacion";
                element.button2.className = "botonCalificacion";
                element.button3.className = "seleccionado";
            });
        });
    });

    preguntasIngles.preguntaE1.button1.addEventListener('click', () => {
        guardarPuntos(preguntasIngles.preguntaE1.pregunta.titulo, 0);
        mostrarPuntos().then((r) => {
            preguntasIngles.preguntaE1.button1.className = "seleccionado";
            preguntasIngles.preguntaE1.button2.className = "botonCalificacion";
        });
    });
    preguntasIngles.preguntaE1.button2.addEventListener('click', () => {
        guardarPuntos(preguntasIngles.preguntaE1.pregunta.titulo, 1);
        mostrarPuntos().then((r) => {
            preguntasIngles.preguntaE1.button1.className = "botonCalificacion";
            preguntasIngles.preguntaE1.button2.className = "seleccionado";
        });
    });

    preguntasIngles.preguntaE2.button1.addEventListener('click', () => {
        guardarPuntos(preguntasIngles.preguntaE2.pregunta.titulo, 0);
        mostrarPuntos().then((r) => {
            preguntasIngles.preguntaE2.button1.className = "seleccionado";
            preguntasIngles.preguntaE2.button2.className = "botonCalificacion";
        });
    });
    preguntasIngles.preguntaE2.button2.addEventListener('click', () => {
        guardarPuntos(preguntasIngles.preguntaE2.pregunta.titulo, 1);
        mostrarPuntos().then((r) => {
            preguntasIngles.preguntaE2.button1.className = "botonCalificacion";
            preguntasIngles.preguntaE2.button2.className = "seleccionado";
        });
    });
};

function restarPuntos(element) {
    element.button2.className == "seleccionado" && sumaPuntos--;
    element.button3.className == "seleccionado" && (sumaPuntos -= 2);
}

function guardarPuntos(titulo, calificacion) {
    if (titulosEvaluados.includes(titulo)) {
        let index = titulosEvaluados.indexOf(titulo);
        titulosEvaluados[index] = titulo;
        puntosObtenidos[index] = calificacion;
    } else {
        titulosEvaluados.push(titulo);
        puntosObtenidos.push(calificacion);
    }
}

async function mostrarPuntos() {
    return await new Promise((resolve, reject) => {
        var Data = { "titulosF": titulosEvaluados, "puntosF": puntosObtenidos, "totalPuntosF": sumaPuntos };
        driver.update("evaluacion", idCartelSeleccionado, Data).then((value) => {
            puntosH3.innerHTML = "Total de puntos: " + sumaPuntos;
            resolve(value);
        }).catch(err => {
            reject(err);
        });
    });
}

function toggleIngles() {
    if (cartel.tipo == "Ciencia básica y/o aplicada") {
        if (sumaPuntos > 29) divContenidoIngles.style.display = 'block';
        else divContenidoIngles.style.display = 'none';
    } else {
        if (sumaPuntos > 24) divContenidoIngles.style.display = 'block';
        else divContenidoIngles.style.display = 'none';
    }
}

function siguienteParte() {
    var flag = true;
    for (let i = 0; i < preguntasEvaluaciones.length; i++) {
        if (!titulosEvaluados.includes(preguntasEvaluaciones[i].pregunta.titulo)) flag = false;
    }
    if (divContenidoIngles.style.display == 'none') {
        if (flag) window.location.href = "evaluacionContenido.html";
        else alertify.alert('Concurso de Carteles', 'Debe evaluar todos las preguntas para avanzar!', function () { alertify.success('Ok'); });
    }else{
        if((preguntasEvaluaciones.length+2) == titulosEvaluados.length) window.location.href = "evaluacionContenido.html";
        else alertify.alert('Concurso de Carteles', 'Debe evaluar todos las preguntas para avanzar!', function () { alertify.success('Ok'); });
    }

}

function puesto() {
    if (localStorage.getItem("Puesto") == "juez"){
        document.getElementById('admP').style.display = "none";
        document.getElementById('admC').style.display = "none";
        document.getElementById('admJ').style.display = "none";
        document.getElementById('admE').style.display = "none";
    }
}