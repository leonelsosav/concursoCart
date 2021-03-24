var firestore = firebase.firestore();
var idCartelSeleccionado = localStorage.getItem('idCartelSeleccionado');
var divContenido = document.getElementById("contenido");
var tabla = document.getElementById("tabla");
var tipoCartel = "";
var driver;

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

    driver.read("cartel", idCartelSeleccionado).then((cartel) => {
        divContenido.appendChild(new Row("Codigo", cartel.clave).div);
        divContenido.appendChild(new Row("Titulo", cartel.titulo).div);
        divContenido.appendChild(new Row("Autor", cartel.autor).div);
        tipoCartel = cartel.tipo;
        divContenido.appendChild(new Row("Tipo de cartel", cartel.tipo).div);
        driver.read("juez", cartel.juez).then((juez) => {
            divContenido.appendChild(new Row("Juez", juez.nombre + " " + juez.apellidos).div);
            cargarEvaluacion();
        });
    });
}

function cargarEvaluacion() {
    crearTexto("Criterios de Forma", "tituloResumen");
    let cal1 = 0;
    let cal2 = 0;
    driver.read("evaluacion", idCartelSeleccionado).then((evaluacion) => {
        evaluacion.titulosF.forEach((titulo, index) => {
            if (titulo != "GRAMATICA" && titulo != "CARTEL EN INGLÉS") divContenido.appendChild(new RowC(titulo, evaluacion.puntosF[index]).div);
            else if (titulo == "GRAMATICA") cal1 = evaluacion.puntosF[index];
            else cal2 = evaluacion.puntosF[index];
        });
        let puntosIngles = 0;
        if (tipoCartel == "Ciencia básica y/o aplicada") {
            if ((cal1 == 1 && cal2 == 1) && evaluacion.totalPuntosF > 29) {
                puntosIngles = 5;
                divContenido.appendChild(new RowC("Puntos extra por ingles", puntosIngles).div);
            }
        } else{
            if ((cal1 == 1 && cal2 == 1) && evaluacion.totalPuntosF > 24) {
                puntosIngles = 5;
                divContenido.appendChild(new RowC("Puntos extra por ingles", puntosIngles).div);
            }
        }
        crearTexto("Total de puntos en el criterio de Forma: " + (evaluacion.totalPuntosF + puntosIngles), "puntosResumen")
        divContenido.appendChild(document.createElement("br"));
        divContenido.appendChild(document.createElement("br"));

        crearTexto("Criterios de Contenido", "tituloResumen");
        evaluacion.titulosC.forEach((titulo, index) => {
            divContenido.appendChild(new RowC(titulo, evaluacion.puntosC[index]).div);
        });
        crearTexto("Total de puntos en el criterio de Contenido: " + evaluacion.totalPuntosC, "puntosResumen")
        divContenido.appendChild(document.createElement("br"));
        divContenido.appendChild(document.createElement("br"));

        crearTexto("Criterios de Pertinencia", "tituloResumen");
        evaluacion.titulosP.forEach((titulo, index) => {
            divContenido.appendChild(new RowC(titulo, evaluacion.puntosP[index]).div);
        });
        crearTexto("Total de puntos en el criterio de Pertinencia: " + evaluacion.totalPuntosP, "puntosResumen")
        crearTexto("Total de puntos del cartel: " + (evaluacion.totalPuntosP + evaluacion.totalPuntosC + evaluacion.totalPuntosF + puntosIngles), "puntosTotal")
        divContenido.appendChild(document.createElement("br"));
        divContenido.appendChild(document.createElement("br"));

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Puntos por criterio"
            },
            axisY: {
                title: "Puntos"
            },
            data: [{
                type: "column",
                showInLegend: false,
                dataPoints: [
                    { y: evaluacion.totalPuntosF + puntosIngles, label: "Forma" },
                    { y: evaluacion.totalPuntosC, label: "Contenido" },
                    { y: evaluacion.totalPuntosP, label: "Pertinencia" }
                ]
            }]
        });
        chart.render();
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(document.createElement("br"));
    });
}

function crearTexto(titulo, clase) {
    let t = document.createElement("h3");
    t.className = clase;
    t.innerHTML = titulo;
    divContenido.appendChild(t);
}

function puesto() {
    if (localStorage.getItem("Puesto") == "juez"){
        document.getElementById('admP').style.display = "none";
        document.getElementById('admC').style.display = "none";
        document.getElementById('admJ').style.display = "none";
        document.getElementById('admE').style.display = "none";
    }
}