<!-- Fichero conexión para acceder a la base de datos local -->
<?php
    $nombreBase='localhost';
    $nombreUsuario='root';
    $contrasenaBase='';
    $nombreTabla='picsite';

    $conexion=mysqli_connect($nombreBase,$nombreUsuario,$contrasenaBase,$nombreTabla);
?>