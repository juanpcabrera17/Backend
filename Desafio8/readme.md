# DESAFIO 8

1. Ejecutar el archivo tablaMensajes.js para crear la tabla de mensajes en SQLite3
2. Iniciar con XAMPP el servidor de la base de datos MySQL, este se ejecutará en el puerto 3306
3. Ejecutar el archivo tablaProductos.js para crear la tabla de productos en MySQL e insertar 3 productos
4. Ejecutar npm start para iniciar con nodemon el servidor

Los productos que agreguemos desde el formulario web serán almacenados en la base de datos de MySQL. Podemos ver los cambios de esta utilizando MySQL Workbench en el puerto 3306.

Para probar los métodos de los productos ejecutar las siguientes funciones desde la consola en el navegador web:

```
id(number)
deleteId(number)
deleteAll()
replace(number, body)
```

Los mensajes agregados desde el chat web serán almacenados en el archivo Desafio8/DB/ecommerce.sqlite de la base de datos SQLite3
