# Desafio 21

Se modificó el endpoint `/api/productos` para que cumpla con el esquema API RESTful, es decir que se comentaron todos los res.render para hacer res.status.json.

Se creó el archivo test.js, este realiza la validación y verifica el correcto funcionamiento de los métodos get, post y put en el endpoint mencionado anteriormente.

Este archivo utiliza las librerías mocha, chai, supertest y faker. Podemos utilizarlo mediante el siguiente script:

```
"test": "mocha ./test/test.js"
```
