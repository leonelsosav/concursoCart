var firestore = firebase.firestore();
const docRefUsuarios = firestore.collection("usuario");
var usuarioInput = document.getElementById("usuario");
var contrasenaInput = document.getElementById("contrasena");
var idUsuario = "";

function sesion() {
    if (localStorage.getItem("Usuario") !== "" && localStorage.getItem("Usuario") !== null) {
        window.location.href = "nueva-evaluacion.html";
    }
}

function iniciarSesion() {
    if (usuarioInput.value == "" || usuarioInput.value == null) alertify.alert("Concurso de carteles", 'Porfavor ingrese un usuario valido');
    else if (contrasenaInput.value == "" || contrasenaInput.value == null)
        alertify.alert("Concurso de carteles", 'Porfavor ingrese una contraseña valida');
    else {
        docRefUsuarios.where("usuario", "==", usuarioInput.value).get().then(function (querySnapshot) {
            if (!querySnapshot.empty) {
                idUsuario = querySnapshot.docs[0].id;
            }
            else alertify.alert("Concurso de carteles", 'Usuario no encontrado, intente de nuevo');
        }).then(function () {
            if (!idUsuario == "") {
                docRefUsuarios.doc(idUsuario).get().then(function (doc) {
                    if (doc.data().contrasena == contrasenaInput.value) {
                        localStorage.setItem("Usuario", usuarioInput.value);
                        localStorage.setItem("Puesto", doc.data().puesto);
                    }
                    else alertify.alert("Concurso de carteles", 'Contraseña incorrecta, intente de nuevo');
                }).then(function () {
                    if (localStorage.getItem("Usuario") != "" && localStorage.getItem("Usuario") != null) window.location.href = "nueva-evaluacion.html";
                });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}