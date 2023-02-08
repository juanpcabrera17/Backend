# DESAFIO 12

1. Ejecutar el archivo tablaProductos.js para crear la tabla de productos en MySQL e insertar los productos
2. Iniciar con XAMPP el servidor de la base de datos MySQL, este se ejecutará en el puerto 3306
3. Ejecutar npm start para iniciar con nodemon el servidor
4. Ingresar a http://localhost:8000/public/login

**Nombre de usuario:** juanpablo <br/>
**Contraseña:** juanpablopass

## Login Por Formulario

Este desafío fue creado en base al desafío 11, incorpora un mecanismo de login, este utiliza un middleware de autenticación. <br />
El id de la sesión y cookies son almacenados en mongoDB. <br />
El usuario permanecerá loggeado durante 1 minuto, pasado este tiempo será redireccionado a la página de login y, al cabo de 10 minutos expira la sesión. <br />
En el index se muestra un mensaje de bienvenida junto con un botón de deslogeo, este redirecciona al usuario a un mensaje que dura 2 segundos y se redirecciona nuevamente al login.
