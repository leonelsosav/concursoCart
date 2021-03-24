var firestore = firebase.firestore();
var nuevoClaveInput = document.getElementById('RegistroNuevoClave');
var nuevoTituloInput = document.getElementById('RegistroNuevoTitulo');
var nuevoAutorInput = document.getElementById('RegistroNuevoAutor');
var nuevoJuezInput = document.getElementById('RegistroNuevoJuez');
var nuevoTipoInput = document.getElementById('RegistroNuevoTipo');
var nuevoLinkInput = document.getElementById('RegistroNuevoLink');

var editarClaveInput = document.getElementById('RegistroEditarClave');
var editarTituloInput = document.getElementById('RegistroEditarTitulo');
var editarAutorInput = document.getElementById('RegistroEditarAutor');
var editarJuezInput = document.getElementById('RegistroEditarJuez');
var editarTipoInput = document.getElementById('RegistroEditarTipo');
var editarLinkInput = document.getElementById('RegistroEditarLink');
var tabla;
var driver;
var carteles = [];

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
    tabla = $('#table_id').DataTable({
        "scrollX": true
    });

    $(window).on('resize', function () {
        $('#table_id').css('width', '95%');
        tabla.draw(true);
    });
    $('#table_id').css('width', '95%');
    $('#table_id tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tabla.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    tabla.draw(true);
    driver = new DBDriver(firestore);
    driver.readAll("cartel").then((value) => {
        value.forEach((e) => {
            var cartel = new Cartel(e.clave, e.titulo, e.autor, e.juez, e.tipo, e.link);
            tabla.row.add([cartel.clave, cartel.titulo, cartel.autor, cartel.juez, cartel.tipo, cartel.link]);
            carteles.push(cartel);
        });
        tabla.draw(true);
    });
}

function guardarEditarRegistro() {
    let editarClave = editarClaveInput.value;
    let editarTitulo = editarTituloInput.value;
    let editarAutor = editarAutorInput.value;
    let editarJuez = editarJuezInput.value;
    let editarTipo = editarTipoInput.value;
    let editarLink = editarLinkInput.value;
    if (tabla.row('.selected').data() == undefined) alertify.alert('Concurso de Carteles', '¡Debe seleccionar un registro para editar!', function () { alertify.success('Ok'); });
    else if (editarClave == "" || editarTitulo == "" || editarAutor == "" || editarJuez == "" || editarTipo == "" || editarLink == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        let infoTabla = tabla.row('.selected').data();
        let res = carteles.find(o => (o.clave == infoTabla[0] && o.titulo == infoTabla[1] && o.autor == infoTabla[2]
            && o.juez == infoTabla[3] && o.tipo == infoTabla[4] && o.link == infoTabla[5]));
        var Data = { "clave": editarClave, "titulo": editarTitulo, "autor": editarAutor, "juez": editarJuez, "tipo":editarTipo, "link": editarLink };
        driver.delete("cartel", res.clave).then(() => {
            driver.create("cartel", editarClave, Data).then((value) => {
                tabla.row('.selected').remove().draw(false);
                var cartel = new Cartel(value.clave, value.titulo, value.autor, value.juez, value.tipo, value.link);
                tabla.row.add([cartel.clave, cartel.titulo, cartel.autor, cartel.juez, value.tipo, cartel.link]).draw();
                carteles[carteles.indexOf(res)] = cartel;
                esconderFormaEditarRegistro();
                alertify.alert('Concurso de Carteles', '¡Registro editado exitosamente!', function () { alertify.success('Ok'); });
            }).catch((error) => {
                console.log(error);
                alertify.alert('Concurso de Carteles', '¡Ocurrio un error editando el registro, intentelo de nuevo mas tarde!', function () { alertify.success('Ok'); });
            });
        });
    }
}

function guardarNuevoRegistro() {
    let nuevoClave = nuevoClaveInput.value;
    let nuevoTitulo = nuevoTituloInput.value;
    let nuevoAutor = nuevoAutorInput.value;
    let nuevoJuez = nuevoJuezInput.value;
    let nuevoTipo = nuevoTipoInput.value;
    let nuevoLink = nuevoLinkInput.value;
    if (nuevoClave == "" || nuevoTitulo == "" || nuevoAutor == "" || nuevoJuez == "" || nuevoTipo == "" || nuevoLink == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        driver.getNewNumId("cartel").then((value) => {
            var Data = { "clave": nuevoClave, "titulo": nuevoTitulo, "autor": nuevoAutor, "juez": nuevoJuez, "tipo": nuevoTipo, "link": nuevoLink };
            driver.create("cartel", nuevoClave, Data).then((valueC) => {
                var cartel = new Cartel(valueC.clave, valueC.titulo, valueC.autor, valueC.juez, valueC.tipo, valueC.link);
                tabla.row.add([cartel.clave, cartel.titulo, cartel.autor, cartel.juez, cartel.tipo, cartel.link]).draw();
                carteles.push(cartel);
                esconderFormaNuevoRegistro();
                alertify.alert('Concurso de Carteles', '¡Nuevo registro guardado exitosamente!', function () { alertify.success('Ok'); });
            }).catch((error) => {
                console.log(error);
                alertify.alert('Concurso de Carteles', '¡Ocurrio un error creando el registro, intentelo de nuevo mas tarde!', function () { alertify.success('Ok'); });
            });
        });
    }
}

function borrarRegistro() {
    if (tabla.row('.selected').data() != undefined) {
        let infoTabla = tabla.row('.selected').data();
        let res = carteles.find(o => (o.clave == infoTabla[0] && o.titulo == infoTabla[1] && o.autor == infoTabla[2]
            && o.juez == infoTabla[3] && o.tipo == infoTabla[4] && o.link == infoTabla[5]));
        driver.delete("cartel", res.clave).then((value) => {
            tabla.row('.selected').remove().draw(false);
            carteles.splice(carteles.indexOf(res), 1);
            alertify.alert('Concurso de Carteles', '¡Registro eliminado exitosamente!', function () { alertify.success('Ok'); });
        }).catch((err) => {
            console.log(err);
            alertify.alert('Concurso de Carteles', '¡Ocurrio un error eliminando el registro, intentelo de nuevo mas tarde!', function () { alertify.success('Ok'); });
        });
    } else alertify.alert('Concurso de Carteles', '¡Debe seleccionar un registro para eliminar!', function () { alertify.success('Ok'); });
}

function borrarTodo() {
    alertify.confirm('Concurso de Carteles', '¿Desea eliminar todos los registros?', function () {
        let ids = []
        carteles.forEach((element) => {
            ids.push(element.clave);
        });
        ids.forEach((element) => {
            if (element == ids[ids.length - 1])
                driver.delete("cartel", element).then(() => {
                    alertify.alert('Concurso de Carteles', '¡Registros eliminados exitosamente!', function () { alertify.success('Ok'); });
                });
            else driver.delete("cartel", element);
        });
        carteles = [];
        tabla.clear().draw();
        alertify.success('Ok');
    }, function () { alertify.error('Cancel') });
}

function handleFileSelect() {
    var f = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        cargarArchivo(event.target.result)
    };
    reader.readAsDataURL(f);
    document.getElementById("File").value = "";
}

function cargarArchivo(fileHandler) {
    d3.csv(fileHandler).then((data) => {
        data.forEach((element) => {
            var Data = { "clave": element.Clave, "titulo": element.Titulo, "autor": element.Autor, "juez": element.Juez, "tipo" : element.Tipo,"link": element.Link };
            driver.create("cartel", element.Clave, Data).then((value) => {
                var cartel = new Cartel(value.clave, value.titulo, value.autor, value.juez, value.tipo, value.link);
                tabla.row.add([cartel.clave, cartel.titulo, cartel.autor, cartel.juez,  cartel.tipo, cartel.link]).draw();
                carteles.push(cartel);
            }).catch((error) => {
                console.log(error);
            });
        });
    });
}

function esconderFormaNuevoRegistro() {
    let nuevoRegistro = document.getElementById('nuevoRegistro');
    nuevoRegistro.style.display = 'none';
    nuevoClaveInput.value = "";
    nuevoTituloInput.value = "";
    nuevoAutorInput.value = "";
    nuevoJuezInput.value = "";
    nuevoTipoInput.value = "";
    nuevoLinkInput.value = "";
}

function esconderFormaEditarRegistro() {
    let editarRegistro = document.getElementById('editarRegistro');
    editarRegistro.style.display = 'none';
    editarClaveInput.value = ""
    editarTituloInput.value = "";
    editarAutorInput.value = "";
    editarJuezInput.value = "";
    editarTipoInput.value = "";
    editarLinkInput.value = "";
}