# DESAFIO 14

1. Ejecutar el archivo tablaProductos.js para crear la tabla de productos en MySQL e insertar los productos
2. Iniciar con XAMPP el servidor de la base de datos MySQL, este se ejecutará en el puerto 3306
3. Ejecutar npm start para iniciar con nodemon el servidor
4. Ingresar a http://localhost:8000/public/login

## Usuario ya registrado

**Nombre de usuario:** juanpablo <br/>
**Contraseña:** juanpablopass

## Consigna 1

Las credenciales de la base de datos fueron guardadas en variables de entorno en el archivo .env, las cuales son leídas mediante la librería dotenv. <br/>
El puerto de escucha del servidor es leído de los argumentos pasados por la línea de comandos mediante la librería minimist, en caso de no haber ningún argumento en la línea de comandos, el puerto de conexión por defecto es el 8080.

## Consigna 2

Se agregó la ruta /info, en la cual podemos ver los siguientes datos: <br/>

-   Argumentos de entrada
-   Nombre de la plataforma(sistema operativo)
-   Versión de Node.js
-   Memoria total reservada(rss)
-   Path de ejecución
-   Process id
-   Carpeta del proyecto

## Consigna 3

Se agregó la ruta /api/randoms, la cual permite calcular una cantidad de números aleatorios (1-1000) especificada por parámetros de consulta (query). En caso de que no se ingrese el parámetro, se calcularán 100.000.000 números. <br/>
El resultado se devuelve en forma de objeto al front end indicando cuantas veces salió cada número. <br/>
Al ser un proceso pesado para ejecutar, esta ruta no es bloqueante. Podemos comprobarlo ingresando a /api/randoms y a la vez a /public/login.
