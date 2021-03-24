var firestore = firebase.firestore();
var nuevoNombreInput = document.getElementById("JuezNuevoNombre");
var nuevoApellidoInput = document.getElementById("JuezNuevoApellido");
var editarNombreInput = document.getElementById("JuezNuevoNombreE");
var editarApellidoInput = document.getElementById("JuezNuevoApellidoE");
var data = [];
var tabla;
var driver;

function sesion() {
    if (localStorage.getItem("Usuario") == "" || localStorage.getItem("Usuario") == null) window.location.href = "index.html";
    else cargarInfo();
}

function cerrarSesion() {
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
    data.push(["Nombre del Evaluador","Clave QR","Nombre del Cartel", "Seleccionar Rúbrica",""]);
    driver.readWhere("evaluacion", "evaluado", "==", true).then((Evaluaciones) => {
        Evaluaciones.forEach((evaluacion) => {
            driver.read("cartel", evaluacion.id).then((cartel) => {
                driver.read("juez", cartel.juez).then((juez) => {
                    /*let d = [];
                    d.push(juez.nombre + " " + juez.apellidos);
                    d.push(cartel.clave);
                    d.
                    data.push([]);*/
                    let puntosIngles = 0;
                    tabla.row.add([evaluacion.id, cartel.titulo, cartel.autor, juez.nombre + " " + juez.apellidos, evaluacion.totalPuntosF
                        + evaluacion.totalPuntosC + evaluacion.totalPuntosP + puntosIngles]).draw();
                });
            });
        });
    });
}

function exportarInfo() {
    const rows = [
        ["name1", "city1", "some other info"],
        ["name2", "city2", "more info"]
    ];

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "evaluaciones.csv");
    document.body.appendChild(link); 
    link.click();
}

/*function borrarTodo() {
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
}*/