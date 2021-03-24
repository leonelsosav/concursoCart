var firestore = firebase.firestore();
var nuevoTituloInput = document.getElementById('RegistroNuevoTitulo');
var nuevoRubricaInput = document.getElementById('RegistroNuevoRubrica');
var nuevoCriterioInput = document.getElementById('RegistroNuevoCriterio');
var nuevoTipoInput = document.getElementById('RegistroNuevoTipo');

var editarTituloInput = document.getElementById('RegistroEditarTitulo');
var editarRubricaInput = document.getElementById('RegistroEditarRubrica');
var editarCriterioInput = document.getElementById('RegistroEditarCriterio');
var editarTipoInput = document.getElementById('RegistroEditarTipo');
var tabla;
var driver;
var preguntas = [];

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
    driver.readAll("pregunta").then((value) => {
        value.forEach((e) => {
            let pregunta = new Pregunta(e.id, e.titulo, e.rubrica, e.criterio, e.tipo);
            tabla.row.add([pregunta.titulo, pregunta.rubrica, pregunta.criterio, pregunta.tipo]).draw();
            preguntas.push(pregunta);
        });
    });
}

function guardarEditarRegistro() {
    let editarTitulo = editarTituloInput.value;
    let editarRubrica = editarRubricaInput.value;
    let editarCriterio = editarCriterioInput.value;
    let editarTipo = editarTipoInput.value;
    if (tabla.row('.selected').data() == undefined) alertify.alert('Concurso de Carteles', '¡Debe seleccionar un registro para editar!', function () { alertify.success('Ok'); });
    else if (editarTitulo == "" || editarRubrica == "" || editarCriterio == "" || editarTipo == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        let infoTabla = tabla.row('.selected').data();
        let res = preguntas.find(o => (o.titulo == infoTabla[0] && o.rubrica == infoTabla[1] && o.criterio == infoTabla[2] && o.tipo == infoTabla[3]));
        var Data = { "Id": Number(res.id), "titulo": editarTitulo, "rubrica": editarRubrica, "criterio": editarCriterio, "tipo": editarTipo };
        driver.update("pregunta", res.id, Data).then((value) => {
            tabla.row('.selected').remove().draw(false);
            var pregunta = new Pregunta(res.id, editarTitulo, editarRubrica, editarCriterio, editarTipo);
            tabla.row.add([pregunta.titulo, pregunta.rubrica, pregunta.criterio, pregunta.tipo]).draw();
            preguntas[preguntas.indexOf(res)] = pregunta;
            esconderFormaEditarRegistro();
            alertify.alert('Concurso de Carteles', '¡Registro editado exitosamente!', function () { alertify.success('Ok'); });
        }).catch((error) => {
            console.log(error);
            alertify.alert('Concurso de Carteles', '¡Ocurrio un error editando el registro, intentelo de nuevo mas tarde!', function () { alertify.success('Ok'); });
        });
    }
}

function guardarNuevoRegistro() {
    let nuevoTitulo = nuevoTituloInput.value;
    let nuevoRubrica = nuevoRubricaInput.value;
    let nuevoCriterio = nuevoCriterioInput.value;
    let nuevoTipo = nuevoTipoInput.value;
    if (nuevoTitulo == "" || nuevoRubrica == "" || nuevoCriterio == "" || nuevoTipo == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        driver.getNewNumId("pregunta").then((value) => {
            var Data = { "Id": Number(value), "titulo": nuevoTitulo, "rubrica": nuevoRubrica, "criterio": nuevoCriterio, "tipo": nuevoTipo };
            driver.create("pregunta", value, Data).then((valueC) => {
                var pregunta = new Pregunta(value, nuevoTitulo, nuevoRubrica, nuevoCriterio, nuevoTipo);
                tabla.row.add([pregunta.titulo, pregunta.rubrica, pregunta.criterio, pregunta.tipo]).draw();
                preguntas.push(pregunta);
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
        let res = preguntas.find(o => (o.titulo == infoTabla[0] && o.rubrica == infoTabla[1] && o.criterio == infoTabla[2] && o.tipo == infoTabla[3]));
        driver.delete("pregunta", res.id).then((value) => {
            tabla.row('.selected').remove().draw(false);
            preguntas.splice(preguntas.indexOf(res), 1);
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
        preguntas.forEach((element) => {
            ids.push(element.id);
        });
        ids.forEach((element) => {
            if (element == ids[ids.length - 1])
                driver.delete("pregunta", element).then(() => alertify.alert('Concurso de Carteles', '¡Registros eliminados exitosamente!', function () { alertify.success('Ok'); }));
            else driver.delete("pregunta", element);
        });
        preguntas = [];
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
        driver.getNewNumId("pregunta").then((value) => {
            var id = value;
            data.forEach((element) => {
                var Data = { "Id": Number(id), "titulo": element.TITULO, "rubrica": element.RUBRICA, "criterio": element.CRITERIO, "tipo": element.TIPO };
                driver.create("pregunta", id, Data).then((value) => {
                    var pregunta = new Pregunta(value.id, value.titulo, value.rubrica, value.criterio, value.tipo);
                    tabla.row.add([pregunta.titulo, pregunta.rubrica, pregunta.criterio, pregunta.tipo]).draw();
                    preguntas.push(pregunta);
                }).catch((error) => {
                    console.log(error);
                });
                id = (Number(id) + 1).toString();
            });
        });
    });
}

function esconderFormaNuevoRegistro() {
    let nuevoRegistro = document.getElementById('nuevoRegistro');
    nuevoRegistro.style.display = 'none';
    nuevoTituloInput.value = "";
    nuevoRubricaInput.value = "";
    nuevoCriterioInput.value = "";
    nuevoTipoInput.value = "";
}

function esconderFormaEditarRegistro() {
    let editarRegistro = document.getElementById('editarRegistro');
    editarRegistro.style.display = 'none';
    editarTituloInput.value = "";
    editarRubricaInput.value = "";
    editarCriterioInput.value = "";
    editarTipoInput.value = "";
}