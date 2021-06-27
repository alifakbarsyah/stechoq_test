'use strict'

module.exports = (app) => {
    const mahasiswaController = app.controller('mahasiswa')

    let aRoutes = [
        {method: 'get', route: '/', inits: [], middlewares: [mahasiswaController.getPagingMahasiswa]},
        {method: 'get', route: '/jumlah-sks/', inits: [], middlewares: [mahasiswaController.getPagingMahasiswaMataKuliah]},
        {method: 'post', route: '/', inits: [], middlewares: [mahasiswaController.AddMahasiswa]},
        {method: 'get', route: '/:id', inits: [], middlewares: [mahasiswaController.getMahasiswa]},
        {method: 'put', route: '/:id', inits: [], middlewares: [mahasiswaController.EditMahasiswa]},
        {method: 'delete', route: '/:id', inits: [], middlewares: [mahasiswaController.DeleteMahasiswa]}
        
    ]
    return aRoutes
}