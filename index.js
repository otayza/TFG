/**
 * La primera función en ejecutarse carga las imagenes a la pagina de inicio, sin haberse registrado ni iniciado sesion
 * La segunda comprobará si hay alguna sesión y dará paso a la funcion iniciar()
 */

window.onload = () => {
    cargarImagenes();
    comprobarSesion();
};

let contadorImagenes = 0;
let numFotosCargadas;
let imagenActual;
let numeroLikes;

/**
 * Dota a casi todos los elementos del DOM un evento para darles una función determinada
 */

function iniciar() {
    document.querySelector("#inicioSesion").onclick = () => {
        document.querySelector("#formularioInicioSesion").style.display = "block";
        document.querySelector("#formularioRegistro").style.display = "none";
    }

    document.querySelector("#registro").onclick = () => {
        document.querySelector("#formularioRegistro").style.display = "block";
        document.querySelector("#formularioInicioSesion").style.display = "none";
    }

    ocultarModal("formularioRegistro");
    ocultarModal("formularioInicioSesion");
    ocultarModal("cargarImagen");

    document.querySelector("#buscar").onclick = () => { buscarImagenesUsuarios();busquedaNueva() }
    document.querySelector("#buscador").onkeypress = function (e) {
        if (e.keyCode == 13) { buscarImagenesUsuarios();busquedaNueva() }
    }

    document.querySelector("#iniciarSesion").onclick = () => {
        if (comprobarFormulario("iniciarSesion")) {
            document.querySelector("#formularioInicioSesion").style.display = "none";
        }
    }

    document.querySelector("#pwd2").onkeypress = function (e) {
        if (e.keyCode == 13) {
            if (comprobarFormulario("iniciarSesion")) {
                document.querySelector("#formularioInicioSesion").style.display = "none";
            }
        }
    }

    document.querySelector("#registrarse").onclick = () => {
        if (comprobarFormulario("registrarse")) {
            document.querySelector("#formularioRegistro").style.display = "none";
        }
    }

    document.querySelector("#edad").onkeypress = function (e) {
        if (e.keyCode == 13) {
            if (comprobarFormulario("registrarse")) {
                document.querySelector("#formularioRegistro").style.display = "none";
            }
        }
    }


    document.querySelector("#cerrarSesion").onclick = cerrarSesion;
    document.querySelector("#atras").onclick = () => {
        document.querySelector("#comentarImagen").style.display = "none";
        document.querySelector("#contenedor").style.display = "flex";
    }

    document.querySelector("#comentar").onclick = comentarioNuevo;

    document.querySelector("#email").onkeyup = function () { comprobarCampo("#email") ? this.style.border = "4px solid greenyellow" : this.style.border = "3px solid red" };
    document.querySelector("#pwd").onkeyup = function () { comprobarCampo("#pwd") ? this.style.border = "4px solid greenyellow" : this.style.border = "3px solid red" };

    document.querySelector("#subirImagen").onclick = () => { document.querySelector("#cargarImagen").style.display = "flex" };

    document.querySelector("#miImagen").onchange = () => {
        subirImagen(document.querySelector("#miImagen").files[0]);
        document.querySelector("#vistaPrevia").style.display = "block";
    }
}

/**
 * Corresponde a la primera funcion en ser llamada cuando se carga el fichero HTML. Aporta solamente 3 imagenes
 * a la primera pagina. La pagina que se presenta al usuario que no se ha registrado ni iniciado sesion.
 * 
 * Es una peticion get a la API de pixabay
 */

function cargarImagenes() {
    let envio = new XMLHttpRequest();
    numFotosCargadas = 3;
    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            var fotos = JSON.parse(envio.responseText);
            for (let i = 0; i < numFotosCargadas; i++) {
                let ele = new Foto(fotos['hits'][i]['largeImageURL'], fotos['hits'][i]['user']);
                document.querySelector("#inicio").append(ele.getFoto2);
            }
        }
    }
    var API_KEY = '21329306-be536672394d00fac6fe8d571';
    var url = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent("planeta tierra") + "&per_page=10&image_type='photos'&lang=es";
    envio.open("GET", url, true);
    envio.send();
}


/**
 * Esta función se encargará de sumar 3 objetos junto a las imagenes de la API y mostrarlos en el scroll infinito
 * 
 * Si el parametro inicio es verdadero, empezará subiendo 9 imagenes para activar el scroll
 */

function buscarImagenes(busqueda, inicio) {
    if (numFotosCargadas >= 198) {
        return;
    }
    let envio = new XMLHttpRequest();
    if (inicio) {
        numFotosCargadas = 9;
        document.querySelector("#contenedor").innerHTML = "";
        envio.onreadystatechange = () => {
            if (envio.readyState == 4 && envio.status == 200) {
                var fotos = JSON.parse(envio.responseText);
                for (let i = 0; i < numFotosCargadas; i++) {
                    let atr = fotos['hits'][i];
                    let ele = new Foto(atr['largeImageURL'], atr['user'], atr['id'], atr["likes"]);
                    let aux = ele.getFoto;
                    document.querySelector("#contenedor").append(aux);
                    aux.onclick = () => { verificarImagen(ele); comentarios(ele) };
                }

            }
        }
    } else {
        envio.onreadystatechange = () => {
            if (envio.readyState == 4 && envio.status == 200) {
                numFotosCargadas = numFotosCargadas + 3;
                var fotos = JSON.parse(envio.responseText);
                for (let i = numFotosCargadas - 3; i < numFotosCargadas; i++) {
                    let atr = fotos['hits'][i];
                    let ele = new Foto(atr['largeImageURL'], atr['user'], atr['id'], atr["likes"]);
                    let aux = ele.getFoto;
                    document.querySelector("#contenedor").append(aux);
                    aux.onclick = () => { comentarios(ele); verificarImagen(ele) };
                }

            }
        }
    }

    var API_KEY = '21329306-be536672394d00fac6fe8d571';
    var url = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(busqueda) + "&per_page=200&image_type='photos'&lang=es";
    envio.open("GET", url, true);
    envio.send();
}

/**
 * Aporta las funciones de modal a todo elemento pasado por parámetro. Se usa solo para los contenedores de
 * formularios
 */

function ocultarModal(elemento) {
    document.getElementById(elemento).onclick = (e) => {
        if (e.target.id == elemento) {
            document.getElementById(elemento).style.display = "none";
            document.querySelector(`#${elemento} textarea`) ? document.querySelector(`#${elemento} textarea`).value = "" : false;
            let arregloInput = document.querySelectorAll(`#${elemento} input`);

            for (let i = 0; i < arregloInput.length; i++) {
                arregloInput[i].value = "";
            }

            document.querySelector(`#vistaPrevia`).style.display = "none";
        }
    }
}

/**
 * Oculta el contenedor de imagenes y muestra la imagen y su seccion de comentarios
 */

function comentarios(elemento) {

    document.querySelector("#contenedor").style.display = "none";
    if (document.querySelector("#comentarImagen").childNodes.length > 4) {
        document.querySelector("#comentarImagen").removeChild(document.querySelector("#comentarImagen").childNodes[4]);
    }
    let aux = elemento.getFoto3;
    aux.style.order = "1";
    document.querySelector("#comentarImagen").style.display = "flex";
    document.querySelector("#comentarImagen").append(aux);
    document.querySelector("#like").onclick = darLike;

}

/**
 * Funcion que oculta la seccion de comentarios de una imagen y muestra el contenedor de imagenes en funcion 
 * de la nueva busqueda. Si no existe el parametro busqueda o no tiene valor, tomará el valor del buscador.
 */

function busquedaNueva(busqueda) {
    if (!busqueda) {
        busqueda = document.querySelector("#buscador").value;
    }
    document.querySelector("#contenedor").style.display = "flex";
    document.querySelector("#comentarImagen").style.display = "none";
    numFotosCargadas = 9;
    buscarImagenes(busqueda, true);
    document.querySelector("#contenedor").onscroll = () => {
        buscarImagenes(busqueda, false);
    }
}

/**
 * Comprueba los formularios de registro e inicio de sesión. Cuenta el numero de campos y envia peticiones al servidor
 * en función del numero de campos.
 */

function comprobarFormulario(tipoFormulario) {
    let arregloCampos;
    let peticion = [];
    if (tipoFormulario == "iniciarSesion") {
        arregloCampos = document.querySelectorAll("#formularioInicioSesion form input");
    } else {
        arregloCampos = document.querySelectorAll("#formularioRegistro form input");
    }
    for (let i = 0; i < arregloCampos.length; i++) {
        if (comprobarCampo(`#${arregloCampos[i].id}`)) {
            peticion[i] = arregloCampos[i].value;
            arregloCampos[i].value = "";
        } else {
            arregloCampos[i].id == "email" ? mostrarAlert("correo") : mostrarAlert("contraseña");
            return false;
        }
    }
    arregloCampos.length == 2 ? peticionServidor2(peticion) : peticionServidor1(peticion);
    return true;
}

/**
 * Envia la peticion de registro de usuario en la base de datos. Si la respuesta del servidor es false, significa
 * que el correo ya se encuentra en la BBDD y muestra un alert con el fallo.
 */

function peticionServidor1(peticion) {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("correoElectronico", peticion[0]);
    data.append("contrasena", peticion[1]);
    data.append("edad", peticion[2]);
    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            if (envio.responseText == false || envio.responseText == "false") {
                mostrarAlert("correoRepetido");
            }
        }
    }
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Verifica si un usuario existe en la BBDD. Si existe, la respuesta del servidor no será de 0 e iniciará la sesión 
 * ocultando botones del header y la pagina de inicio.
 */

function peticionServidor2(peticion) {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("correoElectronico", peticion[0]);
    data.append("contrasena", peticion[1]);

    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            if (envio.responseText != 0 || envio.responseText != "0") {
                sesionIniciada(envio.responseText);
            }
        }
    }

    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Oculta y muestra elementos del DOM cuando la sesion está iniciada.
 */

function sesionIniciada(nombreUsuario) {
    document.querySelector("#validarUsuario").style.display = "none";
    busquedaNueva("planeta tierra");
    document.querySelector("#usu").style.display = "flex";
    document.querySelector("#busqueda").style.display = "flex";
    document.querySelector("#usu").innerHTML = `Bienvenido ${nombreUsuario}`;
    document.querySelector("#cerrarSesion").style.display = "block";
    document.querySelector("#subirImagen").style.display = "block";
    document.querySelector("#contenedor").style.display = "flex";
    document.querySelector("#inicio").style.display = "none";
}

/**
 * Oculta y muestra elementos del DOM cuando la sesion no está iniciada o se ha cerrado.
 */

function sesionNoIniciada() {
    document.querySelector("#validarUsuario").style.display = "flex";
    document.querySelector("#usu").style.display = "none";
    document.querySelector("#busqueda").style.display = "none";
    document.querySelector("#cerrarSesion").style.display = "none";
    document.querySelector("#subirImagen").style.display = "none";
    document.querySelector("#contenedor").style.display = "none";
    document.querySelector("#inicio").style.display = "flex";
    document.querySelector("#comentarImagen").style.display = "none";
}

/**
 * Envia una peticion al servidor cada vez que se recarga la pagina para verificar si hay alguna sesion iniciada.
 * Si no hay ninguna, el servidor responderá con un 0 y se aplicará la funcion correspondiente
 */

function comprobarSesion() {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("comprobarSesion", true);
    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            if (envio.responseText != 0 || envio.responseText != "0") {
                iniciar();
                sesionIniciada(envio.responseText);
            } else {
                iniciar();
                sesionNoIniciada();
            }
        }
    }
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Envia una peticion al servidor para destruir la sesión actual e invoca la funcion de sesionNoIniciada()
 */

function cerrarSesion() {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("cerrarSesion", true);
    sesionNoIniciada();
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Verifica el objeto pasado como parametro y obtiene algunos de sus atributos para subirlos a la BBDD
 * y obtener sus comentarios si existen o generar un nuevo registro en la BBDD con los likes y el identificador
 * unico que aporta la API.
 */

function verificarImagen(elemento) {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("id", elemento.getID);
    data.append("likes", elemento.getLikes);
    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            let respuesta = JSON.parse(envio.responseText);
            imagenActual = parseInt(respuesta[0]);
            elemento.setLikes = respuesta[1];
            elemento.setDescripcion=respuesta[2];
            comentarios(elemento);
            document.querySelector("#comentariosUsuarios").innerHTML = "";
            if (respuesta.length >= 3) {
                for (let i = 3; i < respuesta.length; i += 3) {
                    let c = comentarioUsuario(respuesta[i], respuesta[i + 1], respuesta[i + 2]);
                    document.querySelector("#comentariosUsuarios").append(c);
                }
            }
            respuesta = [];
        }
    }
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Aumenta o reduce el numero de likes en funcion del color de éste. Cada click es una petición al servidor para que
 * actualice el numero de likes de la imagen actual.
 */

function darLike() {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("imagen", imagenActual);
    let numLikes = document.querySelector("#numLikes");
    if (document.querySelector("#like").style.color == "red") {
        data.append("like", "menos");
        document.querySelector("#like").style.color = "black";
        document.querySelector("#like").onmouseover = this.style.color = "rgb(250, 7, 4)";
        document.querySelector("#like").onmouseout = this.style.color = "black";

        numLikes.innerHTML = parseFloat(numLikes.innerHTML) - 1;
    } else {
        data.append("like", "mas");
        document.querySelector("#like").style.color = "red";
        numLikes.innerHTML = parseFloat(numLikes.innerHTML) + 1;
    }
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Realiza una peticion al servidor para generar un comentario nuevo en la BBDD
 */

function comentarioNuevo() {
    let comentario = document.querySelector("#miComentario").value;

    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("comentario", comentario);
    data.append("imagenid", imagenActual);
    envio.open("POST", "servidor.php", true);
    envio.send(data);

    document.querySelector("#miComentario").value = "";
    actualizarComentarioUsuario();
}

/**
 * Despues de obtener la informacion de los comentarios como parametros, les da el mismo estilo a todos ellos y 
 * los agrega a la sección de comentarios de una imagen determinada. 
 */

function comentarioUsuario(comentario, usuario, fecha) {
    let ele = document.createElement("div");
    ele.classList.add("comentarioUsuario");

    let comentarioUsuario = document.createElement("div");
    comentarioUsuario.classList.add("comentario");
    comentarioUsuario.innerHTML = comentario;

    let infoUsuario = document.createElement("div");
    infoUsuario.classList.add("infoUsuario");
    infoUsuario.innerHTML = `By: ${usuario}`;
    infoUsuario.style.fontSize = "0.8rem";
    let infoFecha = document.createElement("div");
    infoFecha.classList.add("infoFecha");
    infoFecha.innerHTML = fecha;
    infoFecha.style.fontSize = "0.8rem";

    ele.append(comentarioUsuario);
    ele.append(infoUsuario);
    ele.append(infoFecha);

    return ele;
}

/**
 * Valida el contenido de un campo y devuelve false si la validacion por expresion regular falla.
 */

function comprobarCampo(elemento) {
    let regexp;
    if (elemento == "#email") {
        regexp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return regexp.test(document.querySelector(elemento).value);
    } else if (elemento == "#pwd") {
        regexp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
        return regexp.test(document.querySelector(elemento).value);
    }
    return true;
}

/**
 * Muestra una alerta personalizada si hay algún fallo en el registro de usuarios
 */

function mostrarAlert(fallo) {
    let alerta = document.querySelector("#alert");
    alerta.innerHTML = "";

    switch (fallo) {
        case "correo":
            alerta.innerHTML = "Escriba un correo válido";
            break;
        case "contraseña":
            alerta.innerHTML = "La contraseña debe tener entre 8 y 16 carácteres, incluyendo, mínimo, una mayúscula y una minúscula";
            break;
        case "correoRepetido":
            alerta.innerHTML = "Ya existe una cuenta con ese correo electrónico";
            break;
        default:
            alerta.innerHTML = "Fallo en la aplicación. Disculpe las molestias";
    }

    alerta.style.display = "block";
    setTimeout(() => { alerta.style.display = "none" }, 13000);
    alerta.onclick = function () { this.style.display = "none" }

}

/**
 * Se llama cada vez que un usuario hace un comentario en alguna imagen. Envia una peticion al servidor y 
 * vuelve a recibir todos los comentarios de una determinada imagen. Esta vez incluirá el nuevo comentario escrito
 */

function actualizarComentarioUsuario() {
    let envio = new XMLHttpRequest();
    let data = new FormData();
    data.append("imagenActual", imagenActual);
    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            let respuesta = JSON.parse(envio.responseText);
            document.querySelector("#comentariosUsuarios").innerHTML = "";
            for (let i = 0; i < respuesta.length; i += 3) {
                let c = comentarioUsuario(respuesta[i], respuesta[i + 1], respuesta[i + 2]);
                document.querySelector("#comentariosUsuarios").append(c);
            }
            respuesta = [];
        }
    }
    envio.open("POST", "servidor.php", true);
    envio.send(data);
}

/**
 * Sube la imagen seleccionada en el input del formulario para subir una imagen a Imgur. Desde alli, se generará un 
 * enlace a la imagen que añadiremos al formulario a modo de vista previa.
 */

function subirImagen(imagen) {
    let env = new FormData();
    env.append("image", imagen);
    //data.append("imagenURL",imagenURL);
    let envio = new XMLHttpRequest();

    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
            let ele = new Image();
            ele.src = JSON.parse(envio.responseText).data["link"];
            document.querySelector("#vistaPrevia").style.backgroundImage = `url(${ele.src})`;
            document.querySelector("#vistaPrevia").style.backgroundPosition = "center";
            document.querySelector("#vistaPrevia").style.backgroundRepeat = "no-repeat";
            document.querySelector("#vistaPrevia").style.backgroundSize = "cover";

            document.querySelector("#subir").onclick = () => {

                registrarImagen(ele.src, document.querySelector("#descripcion").value, document.querySelector("#etiquetas").value);
            }

        }
    }

    envio.open("POST", "https://api.imgur.com/3/image");
    envio.setRequestHeader("Authorization", "CLIENT-ID 4c0fb4b0a770389");
    envio.send(env);
}

/**
 * Recibe los datos pasados por el formulario a través del método anterior subirImagen() y los informa en la BBDD
 * para crear un nuevo registro de esa imagen.
 */

function registrarImagen(imagen, descripcion, etiquetas) {
    let env = new FormData();
    env.append("urlImagen", imagen);
    env.append("descripcion", descripcion);
    env.append("etiquetas", etiquetas);

    let envio = new XMLHttpRequest();

    envio.open("POST", "servidor.php");
    envio.send(env);
}

/**
 * Envia una peticion al servidor para buscar una imagen en las etiquetas de la BBDD en funcion del valor 
 * del buscador. Si la encuentra, la añade al contenedor de imágenes y le dota de las funciones y eventos propios
 * de un objeto Imagen.
 */

function buscarImagenesUsuarios(){
    let env = new FormData();
    env.append("etiqueta", document.querySelector("#buscador").value);

    let envio = new XMLHttpRequest();

    envio.onreadystatechange = () => {
        if (envio.readyState == 4 && envio.status == 200) {
           if(envio.responseText==0||envio.responseText=="0"){
               return;
           }else{
               let arreglo=JSON.parse(envio.responseText);
               for (let i = 0; i < arreglo.length; i+=4) {
                let ele = new Foto(arreglo[i], arreglo[i+1], arreglo[i+2], arreglo[i+3]);
                console.log(ele);
                let aux = ele.getFoto;
                document.querySelector("#contenedor").append(aux);
                aux.onclick = () => { comentarios(ele); verificarImagen(ele) };
            }
           }

        }
    }

    envio.open("POST", "servidor.php");
    envio.send(env);
}