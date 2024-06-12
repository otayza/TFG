<?php
    require("conexion.php");
    session_start();

    /**
     * Verifica que existe una sesion de usuario. Esta no se cerrará hasta que el usuario cierre el navegador.
     */
    if(isset($_POST["comprobarSesion"])){
        
    if(isset($_SESSION["usuario"])){
        echo $_SESSION["usuario"];
        exit();
    }else{
        echo 0;
        exit();
    }
    }

    /**
     * Actualiza el numero de likes de una determinada imagen en funcion del valor pasado a traves POST[imagen]
     */
    if(isset($_POST["imagen"])){
        $_POST["like"]=="mas"?$consulta="update imagenes set likes=likes+1 where id_imagen='{$_POST['imagen']}'":$consulta="update imagenes set likes=likes-1 where id_imagen='{$_POST['imagen']}'";
        $ejecucion=mysqli_query($conexion, $consulta);
    }

    /**
     * Cierra la sesión del usuario
     */

    if(isset($_POST["cerrarSesion"])){
        session_destroy();
        exit();
    }

/**
 * Verifica si una imagen existe en la BBDD al clicar sobre para evitar la redundancia de datos en el servidor.
 * Si no existe, creará un nuevo registro
 * Si existe, mostrará el numero de likes actualizado y los comentarios si los hay
 */

    if(isset($_POST["id"])){
        $arreglo=[];
        $consulta="select id_imagen,likes,descripcion from imagenes where id_imagen2={$_POST['id']} or id_imagen={$_POST['id']}";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        
        if(!$resultado){
            $consulta="insert into imagenes (id_imagen2,likes) values ('{$_POST['id']}','{$_POST['likes']}')";
            $ejecucion=mysqli_query($conexion, $consulta);
            $consulta="select id_imagen,likes from imagenes where id_imagen2='{$_POST['id']}'";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        array_push($arreglo,$resultado[0],$resultado[1]);
        
        $respuesta=json_encode($arreglo);
        echo $respuesta;
        exit();
        }else{
            $arreglo[0]=$resultado[0];
            $arreglo[1]=$resultado[1];
            $arreglo[2]=$resultado[2];

        $consulta="select c.comentario,u.email,c.fecha from comentarios c join usuarios u on c.id_usuario=u.id_usuario where id_imagen={$resultado[0]} order by c.fecha desc";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        while(!empty($resultado)){
            $fecha_formateada=date("d/m H:i",strtotime($resultado[2]));
            array_push($arreglo,$resultado[0],$resultado[1],$fecha_formateada);
            $resultado=mysqli_fetch_row($ejecucion);
        }

        $respuesta=json_encode($arreglo);
        echo $respuesta;
        exit();
    }  
    }

/**
 * Verifica el formulario de registro. Si se encuentra el resultado en la BBDD no se agregará ningun usuario nuevo, 
 * sino que enviará false como respuesta del servidor.
 */

    if(isset($_POST["edad"])){
        $consulta="Select * from usuarios where email='{$_POST['correoElectronico']}'";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        if($resultado){
            echo "false";
            exit();
        }else{
            echo $consulta;
            $consulta="Insert into usuarios (email,contrasena,edad) values ('{$_POST['correoElectronico']}','{$_POST['contrasena']}','{$_POST['edad']}')";
            $ejecucion=mysqli_query($conexion, $consulta);
        }
        exit();
    }else if(isset($_POST["correoElectronico"])){
        $consulta="Select * from usuarios where email='{$_POST['correoElectronico']}' and contrasena='{$_POST['contrasena']}'";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        if($resultado){
            $_SESSION["usuario"]=$_POST['correoElectronico'];
            echo $_POST['correoElectronico'];
            exit();
        }else{
            echo 0;
            exit();
        }
    }

/**
 * Agrega un comentario en la base de datos según el usuario e imagen  actuales
 */

    if(isset($_POST["comentario"])){
        $consulta="Insert into comentarios (id_imagen,id_usuario,comentario) select {$_POST['imagenid']},id_usuario,'{$_POST['comentario']}' from usuarios where email='{$_SESSION['usuario']}'";
        $ejecucion=mysqli_query($conexion, $consulta);
        exit();
    }

    /**
     * Selecciona los comentarios de una determinada imagen en la BBDD y los envia en un array en formato JSON
     */

    if(isset($_POST["imagenActual"])){
        $arreglo2=[];
        $consulta="select c.comentario,u.email,c.fecha from comentarios c join usuarios u on c.id_usuario=u.id_usuario where c.id_imagen={$_POST['imagenActual']} order by c.fecha desc";        
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        while(!empty($resultado)){
            $fecha_formateada=date("d/m H:i",strtotime($resultado[2]));
            array_push($arreglo2,$resultado[0],$resultado[1],$fecha_formateada);
            $resultado=mysqli_fetch_row($ejecucion);
        }

        $respuesta=json_encode($arreglo2);
        echo $respuesta;
        exit();
    }

/**
 * Inserta una imagen nueva desde el formulario de subir imagen.
 */

    if(isset($_POST["urlImagen"])){
        $consulta="insert into imagenes (url,descripcion,etiquetas,autor) values ('{$_POST['urlImagen']}','{$_POST['descripcion']}','{$_POST['etiquetas']}','{$_SESSION['usuario']}')";
            $ejecucion=mysqli_query($conexion, $consulta);
        exit();
    }


    /**
     * Busca en la base de datos alguna imagen cuya etiqueta corresponda con el valor pasado a través del buscador
     * Si existe, la mostrará entre las primeras imágenes, sino, dara paso a las imagenes de la API
     */
    
    if(isset($_POST["etiqueta"])){
        $arreglo=[];
        
        $consulta="select url,autor,id_imagen,likes from imagenes where etiquetas like '%{$_POST['etiqueta']}%'";
        $ejecucion=mysqli_query($conexion, $consulta);
        $resultado=mysqli_fetch_row($ejecucion);
        if($resultado){
            while(!empty($resultado)){
                array_push($arreglo,$resultado[0],$resultado[1],$resultado[2],$resultado[3]);
                $resultado=mysqli_fetch_row($ejecucion);
            }
            $respuesta=json_encode($arreglo);
            echo $respuesta;
            exit();
        }else{
            echo 0;
        }
    }
?>