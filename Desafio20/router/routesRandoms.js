const { Router } = require('express');

//const {controller}
const controllerGetRandoms = require('../controller/controllerRandoms');

const routerRandoms = new Router();

routerRandoms.get('/', controllerGetRandoms);

module.exports = routerRandoms;
