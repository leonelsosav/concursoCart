var firestore = firebase.firestore();
var idCartelSeleccionado = localStorage.getItem('idCartelSeleccionado');
var divContenido = document.getElementById("contenido");
var preguntasEvaluaciones = [];
var titulosEvaluados = [];
var puntosObtenidos = [];
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
    let cartel;
    driver.read("cartel", idCartelSeleccionado).then((value) => {
        cartel = new Cartel(value.clave, value.titulo, value.autor, value.juez, value.tipo, value.link);
        driver.readWhereWhereOrder("pregunta", "criterio", "==", "Pertinencia", "tipo", "==", cartel.tipo, "Id", "asc").then((resultData) => {
            resultData.forEach((element) => {
                let pregunta = new Pregunta(element.id, element.titulo, element.rubrica, element.criterio, element.tipo);
                let preguntaEvaluacion = new PreguntaEvaluacionP(cartel, pregunta);
                divContenido.appendChild(preguntaEvaluacion.div);
                preguntasEvaluaciones.push(preguntaEvaluacion);
            });
            divContenido.appendChild(document.createElement('br'));
            divContenido.appendChild(document.createElement('br'));
            driver.read("evaluacion", idCartelSeleccionado).then((value) => {
                if (value.clave == undefined) {
                    alertify.alert('Concurso de Carteles', '¡Primero debe evaluar la forma del cartel!', function () { window.location.href = "nueva-evaluacion.html"; });
                } else {
                    titulosEvaluados = value.titulosP == undefined ? [] : value.titulosP;
                    puntosObtenidos = value.puntosP == undefined ? [] : value.puntosP;
                    sumaPuntos = value.totalPuntosP == undefined ? 0 : value.totalPuntosP;
                    puntosH3.innerHTML = "Total de puntos: " + sumaPuntos;
                    for (let i = 0; i < titulosEvaluados.length; i++) {
                        let res = preguntasEvaluaciones.find((o) => o.pregunta.titulo == titulosEvaluados[i]);
                        if (puntosObtenidos[i] == 0) res.button1.className = "seleccionado";
                        else if (puntosObtenidos[i] == 1) res.button2.className = "seleccionado";
                        else if (puntosObtenidos[i] == 2) res.button3.className = "seleccionado";
                        else res.button4.className = "seleccionado";
                    }
                    listenersBotones();
                }
            });
        });
    });
}

function listenersBotones() {
    preguntasEvaluaciones.forEach((element) => {
        element.button1.addEventListener('click', () => {
            restarPuntos(element);
            guardarPuntos(element.pregunta.titulo, 0);
            mostrarPuntos().then((r) => {
                element.button1.className = "seleccionado";
                element.button2.className = "botonCalificacion";
                element.button3.className = "botonCalificacion";
                element.button4.className = "botonCalificacion";
            });
        });
        element.button2.addEventListener('click', () => {
            restarPuntos(element);
            sumaPuntos++;
            guardarPuntos(element.pregunta.titulo, 1);
            mostrarPuntos().then((r) => {
                element.button1.className = "botonCalificacion";
                element.button2.className = "seleccionado";
                element.button3.className = "botonCalificacion";
                element.button4.className = "botonCalificacion";
            });
        });
        element.button3.addEventListener('click', () => {
            restarPuntos(element);
            sumaPuntos += 2;
            guardarPuntos(element.pregunta.titulo, 2);
            mostrarPuntos().then((r) => {
                element.button1.className = "botonCalificacion";
                element.button2.className = "botonCalificacion";
                element.button3.className = "seleccionado";
                element.button4.className = "botonCalificacion";
            });
        });
        element.button4.addEventListener('click', () => {
            restarPuntos(element);
            sumaPuntos += 3;
            guardarPuntos(element.pregunta.titulo, 3);
            mostrarPuntos().then((r) => {
                element.button1.className = "botonCalificacion";
                element.button2.className = "botonCalificacion";
                element.button3.className = "botonCalificacion";
                element.button4.className = "seleccionado";
            });
        });
    });
};

function restarPuntos(element) {
    element.button2.className == "seleccionado" && sumaPuntos--;
    element.button3.className == "seleccionado" && (sumaPuntos -= 2);
    element.button4.className == "seleccionado" && (sumaPuntos -= 3);
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
        var Data = { "titulosP": titulosEvaluados, "puntosP": puntosObtenidos, "totalPuntosP": sumaPuntos };
        driver.update("evaluacion", idCartelSeleccionado, Data).then((value) => {
            puntosH3.innerHTML = "Total de puntos: " + sumaPuntos;
            resolve(value);
        }).catch(err => {
            reject(err);
        });
    });
}

function siguienteParte() {
    if(preguntasEvaluaciones.length == titulosEvaluados.length) {
        var Data = { "evaluado": true };
        driver.update("evaluacion", idCartelSeleccionado, Data).then((value) => {
            window.location.href = "resumenEvaluacion.html";
        }).catch(err => {
            console.log(err);
        });
    }
    else alertify.alert('Concurso de Carteles', 'Debe evaluar todos las preguntas para avanzar!', function () { alertify.success('Ok'); });
}

function puesto() {
    if (localStorage.getItem("Puesto") == "juez"){
        document.getElementById('admP').style.display = "none";
        document.getElementById('admC').style.display = "none";
        document.getElementById('admJ').style.display = "none";
        document.getElementById('admE').style.display = "none";
    }
}