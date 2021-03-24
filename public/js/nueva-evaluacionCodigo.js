var firestore = firebase.firestore();
var sidenav = document.getElementById('sidenav');
var juezInput = document.getElementById('jueces');
var listaJueces = document.getElementById('listaJueces');
var listaCarteles = document.getElementById('listaCarteles');
var idJuezSeleccionado;
var idCartelSeleccionado;
var indexCartelSeleccionado;
var jueces = [];
var carteles = [];
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
    document.getElementById('botonSiguiente').addEventListener('click', () => {
        calificar();
    })
    juezInput.addEventListener('change', () => {
        let res = jueces.find(o => (o.nombre + " " + o.apellido) == juezInput.value);
        idJuezSeleccionado = res.id;
        cargarCarteles();
    });
    listaCarteles.addEventListener('change', () => {
        let res = carteles.find(o => o.clave == listaCarteles.value);
        indexCartelSeleccionado = carteles.indexOf(res);
        idCartelSeleccionado = res.clave;
        listaCarteles.style.backgroundColor =
            cargarInfoCartel();
    });
    driver = new DBDriver(firestore);
    driver.readAll("juez").then((value) => {
        var options = '';
        value.forEach((e) => {
            let juez = new Juez(e.id, e.nombre, e.apellidos);
            options += '<option value="' + juez.nombre + " " + juez.apellido + '" />';
            jueces.push(juez);
        });
        listaJueces.innerHTML = options;
    });

}

function cargarCarteles() {
    driver.readWhere("cartel", "juez", "==", idJuezSeleccionado).then((value) => {
        var i, L = listaCarteles.options.length - 1;
        for (i = L; i >= 0; i--) {
            listaCarteles.remove(i);
        }
        value.forEach((e) => {
            let cartel = new Cartel(e.clave, e.titulo, e.autor, e.juez, e.tipo, e.link);
            let option = document.createElement('option');
            option.text = (cartel.clave);
            driver.read("evaluacion", cartel.clave).then((valueC) => {
                if (valueC.evaluado) option.classList.add("evaluado");
                else if (valueC.evaluado != undefined) option.classList.add("pendiente");
            });
            option.classList.add("opt");
            carteles.push(cartel);
            listaCarteles.add(option);
        });
        listaCarteles.value = "";
    });
}

function cargarInfoCartel() {
    document.getElementById('titulo').innerHTML = "Titulo: " + carteles[indexCartelSeleccionado].titulo;
    document.getElementById('autor').innerHTML = "Autor: " + carteles[indexCartelSeleccionado].autor;
    document.getElementById('hipervinculo').href = carteles[indexCartelSeleccionado].link;
    mostrarInfoCartelDiv();
}

function mostrarInfoCartelDiv() {
    document.getElementById('infoCartel').style.display = 'block';
}

function calificar() {
    if (idCartelSeleccionado == null || idCartelSeleccionado == "") alertify.alert('Concurso de Carteles', '¡Debe seleccionar un cartel para evaluar!', function () { alertify.success('Ok'); });
    else {
        localStorage.setItem("idCartelSeleccionado", idCartelSeleccionado);
        window.location.href = "evaluacionForma.html";
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