/**
 * Clase que permitirá crear objetos fotos mostrando 3 vistas diferentes
 */

class Foto {
    constructor(imagen, autor, id, likes) {
        this.imagen = imagen;
        this.autor = autor;
        this.id = id;
        this.likes = likes;
        this.descripcion = "Sin descripción";
    }

    get getImagen() {
        let url = this.imagen.match(/get\/[A-Za-z0-9_.]+/g);
        let newUrl = url[0].substring(4, url[0].length);
        return newUrl;
    }

    set setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }

    set setLikes(likes) {
        this.likes = likes;
    }

    get getLikes() {
        return this.likes;
    }

    get getID() {
        return this.id;
    }

    /**
     * Primera visión, Foto con imagen y nombre de autor, versión para contenedor de imágenes
     */

    get getFoto() {
        let ele = document.createElement("div");
        ele.style.width = "30%";
        ele.style.height = "50%";

        let infoAutor = document.createElement("div");
        infoAutor.style.height = "15%";
        infoAutor.innerHTML = "Por: " + this.autor;

        let contenedorImagen = document.createElement("div");
        contenedorImagen.style.width = "100%";
        contenedorImagen.style.height = "85%";
        contenedorImagen.style.backgroundImage = `url(${this.imagen})`;
        contenedorImagen.style.backgroundPosition = "center";
        contenedorImagen.style.backgroundRepeat = "no-repeat";
        contenedorImagen.style.backgroundSize = "cover";

        ele.append(contenedorImagen);
        ele.append(infoAutor);
        ele.classList.add("foto");
        return ele;
    }

    /**
     * Segunda visión, solo se ve la foto. Visible en el menú sin haberse registrado o iniciado sesión
     */

    get getFoto2() {
        let ele = document.createElement("div");
        ele.style.width = "30%";
        ele.style.height = "50%";

        let contenedorImagen = document.createElement("div");
        contenedorImagen.style.width = "100%";
        contenedorImagen.style.height = "85%";
        contenedorImagen.style.backgroundImage = `url(${this.imagen})`;
        contenedorImagen.style.backgroundPosition = "center";
        contenedorImagen.style.backgroundRepeat = "no-repeat";
        contenedorImagen.style.backgroundSize = "cover";

        ele.append(contenedorImagen);
        ele.classList.add("foto2");
        return ele;
    }

    /**
     * Tercera visión, disponible a la hora de comentar, esta visión incluye likes, descripción, autor e imagen
     */

    get getFoto3() {
        let ele = document.createElement("div");
        ele.style.width = "50%";
        ele.style.height = "90%";


        let info = document.createElement("div");
        info.style.height = "10%";
        let infoAutor = document.createElement("div");
        infoAutor.innerHTML = `Por: ${this.autor}`;
        let infoLikes = document.createElement("div");
        infoLikes.id = "infoLikes";

        let likes = document.createElement("i");
        likes.classList.add("fas");
        likes.classList.add("fa-heart");
        likes.id = "like";
        infoLikes.append(likes);
        let textoLikes = document.createElement("div");
        textoLikes.innerHTML = this.likes;
        textoLikes.id = "numLikes";
        infoLikes.append(textoLikes);

        info.style.display = "flex";
        info.style.justifyContent = "space-around";
        info.style.alignItems = "center";
        info.append(infoAutor);
        info.append(infoLikes);

        let contenedorImagen = document.createElement("div");
        contenedorImagen.style.width = "100%";
        contenedorImagen.style.height = "70%";
        contenedorImagen.style.backgroundImage = `url(${this.imagen})`;
        contenedorImagen.style.backgroundPosition = "center";
        contenedorImagen.style.backgroundRepeat = "no-repeat";
        contenedorImagen.style.backgroundSize = "cover";

        let descripcion = document.createElement("div");
        descripcion.innerHTML = `${this.descripcion}`;
        ele.style.order = 1;

        ele.append(contenedorImagen);
        ele.append(info);
        ele.append(descripcion);
        ele.classList.add("foto3");
        return ele;
    }
}