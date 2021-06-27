'use strict'

module.exports = (app) => {
    const mataKuliahController = app.controller('mata_kuliah')

    let aRoutes = [
        {method: 'get', route: '/', inits: [], middlewares: [mataKuliahController.getPagingMataKuliah]},
        {method: 'post', route: '/', inits: [], middlewares: [mataKuliahController.AddMataKuliah]},
        {method: 'get', route: '/:id', inits: [], middlewares: [mataKuliahController.getMataKuliah]},
        {method: 'put', route: '/:id', inits: [], middlewares: [mataKuliahController.EditMataKuliah]},
        {method: 'delete', route: '/:id', inits: [], middlewares: [mataKuliahController.DeleteMataKuliah]}
        
    ]
    return aRoutes
}