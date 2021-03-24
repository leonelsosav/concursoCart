cargarInfoBase();

function cargarInfoBase(){
    document.getElementById('menu').addEventListener('click', () => {
        sidenav.classList.toggle("show");
    });
}

function editarRegistro() {
    let editarRegistroDiv = document.getElementById('editarRegistro');
    if (editarRegistroDiv.style.display == 'inline-block') esconderFormaEditarRegistro();
    else {
        editarRegistroDiv.style.display = 'inline-block';
        esconderFormaNuevoRegistro();
    }
}

function agregarRegistro() {
    let nuevoRegistro = document.getElementById('nuevoRegistro');
    if (nuevoRegistro.style.display == 'inline-block') esconderFormaNuevoRegistro();
    else {
        nuevoRegistro.style.display = 'inline-block';
        esconderFormaEditarRegistro();
    }
}