'use strict';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../../swagger.json');

module.exports = (app, router) => {
    const mainController = app.controller('main');

    router.get('/', mainController.index);
    router.use('/program-studi' + '/', app.route('program_studi'));
    router.use('/mahasiswa' + '/', app.route('mahasiswa'));
    router.use('/mata-kuliah' + '/', app.route('mata_kuliah'));
    router.use('/krs' + '/', app.route('krs'));
    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerDocument));
};