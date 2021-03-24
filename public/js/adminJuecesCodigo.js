var firestore = firebase.firestore();
var nuevoNombreInput = document.getElementById("JuezNuevoNombre");
var nuevoApellidoInput = document.getElementById("JuezNuevoApellido");
var editarNombreInput = document.getElementById("JuezNuevoNombreE");
var editarApellidoInput = document.getElementById("JuezNuevoApellidoE");
var tabla;
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
    driver.readAll("juez").then((value) => {
        value.forEach((e) => {
            tabla.row.add([e.id, e.nombre, e.apellidos]).draw();
        });
    });
}

function guardarEditarRegistro() {
    let editarNombre = editarNombreInput.value;
    let editarApellido = editarApellidoInput.value;
    if (tabla.row('.selected').data() == undefined) alertify.alert('Concurso de Carteles', '¡Debe seleccionar un registro para editar!', function () { alertify.success('Ok'); });
    else if (editarNombre == "" || editarApellido == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        var dataArray = tabla.row('.selected').data();
        var Data = { "Id": Number(dataArray[0]), "nombre": editarNombre, "apellidos": editarApellido};
        driver.update("juez", dataArray[0], Data).then((value) => {
            tabla.row('.selected').remove().draw(false);
            tabla.row.add([value.id, value.nombre, value.apellidos]).draw();
            esconderFormaEditarRegistro();
            alertify.alert('Concurso de Carteles', '¡Registro editado exitosamente!', function () { alertify.success('Ok'); });
        }).catch((error) =>{
            console.log(error);
            alertify.alert('Concurso de Carteles', '¡Ocurrio un error editando el registro, intentelo de nuevo mas tarde!', function () { alertify.success('Ok'); });
        });
    }
}

function guardarNuevoRegistro() {
    let nuevoNombre = nuevoNombreInput.value;
    let nuevoApellido = nuevoApellidoInput.value;
    if (nuevoNombre == "" || nuevoApellido == "") alertify.alert('Concurso de Carteles', '¡Porfavor no deje campos vacios!', function () { alertify.success('Ok'); });
    else {
        driver.getNewNumId("juez").then((value) => {
            let Data = { "Id": Number(value), "nombre": nuevoNombre, "apellidos": nuevoApellido };
            driver.create("juez", value, Data).then((valueC) => {
                tabla.row.add([valueC.id, valueC.nombre, valueC.apellidos]).draw();
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
        let data = tabla.row('.selected').data();
        driver.delete("juez", data[0]).then((value) => {
            tabla.row('.selected').remove().draw(false);
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
        for (let i = 0; i < tabla.rows().count(); i++) {
            ids.push(tabla.rows().data()[i][0]);
        }
        ids.forEach((element) => {
            if(element == ids[ids.length-1]) 
            driver.delete("juez",element).then(() => alertify.alert('Concurso de Carteles', '¡Registros eliminados exitosamente!', function () { alertify.success('Ok'); }));
            else driver.delete("juez",element);
        });
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
        driver.getNewNumId("juez").then((value) => {
            var id = value;
            data.forEach((element) => {
                let Data = { "Id": Number(id), "nombre": element.Nombre, "apellidos": element.Apellidos };
                driver.create("juez", id, Data).then((value) => {
                    tabla.row.add([value.id, value.nombre, value.apellidos]).draw();
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
    nuevoNombreInput.value = "";
    nuevoApellidoInput.value = "";
}

function esconderFormaEditarRegistro() {
    let editarRegistro = document.getElementById('editarRegistro');
    editarRegistro.style.display = 'none';
    editarNombreInput.value = "";
    editarApellidoInput.value = "";
}