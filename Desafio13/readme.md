# DESAFIO 13

1. Ejecutar el archivo tablaProductos.js para crear la tabla de productos en MySQL e insertar los productos
2. Iniciar con XAMPP el servidor de la base de datos MySQL, este se ejecutará en el puerto 3306
3. Ejecutar npm start para iniciar con nodemon el servidor
4. Ingresar a http://localhost:8000/public/login

## Usuario ya registrado

**Nombre de usuario:** juanpablo <br/>
**Contraseña:** juanpablopass

## Login Por Formulario

Este desafío fue creado en base al desafío 12, almacena usuarios registrados en una nueva colección de usuarios de MongoDB. <br />
Encripta las contraseñas utilizando bcrypt <br/>
Realiza la autenticación de usuarios mediante un login y una estrategia de passport local <br/>
El usuario permanecerá loggeado durante 1 minuto, pasado este tiempo será redireccionado a la página de login y, al cabo de 10 minutos expira la sesión. <br />
