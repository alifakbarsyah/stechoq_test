'use strict'

module.exports = (app) => {
    const programStudiController = app.controller('program_studi')

    let aRoutes = [
        {method: 'get', route: '/', inits: [], middlewares: [programStudiController.getPagingProgramStudi]},
        {method: 'get', route: '/list-matakuliah/', inits: [], middlewares: [programStudiController.getPagingListMatakuliah]},
        {method: 'post', route: '/', inits: [], middlewares: [programStudiController.AddProgramStudi]},
        {method: 'get', route: '/:id', inits: [], middlewares: [programStudiController.getProgramStudi]},
        {method: 'put', route: '/:id', inits: [], middlewares: [programStudiController.EditProgramStudi]},
        {method: 'delete', route: '/:id', inits: [], middlewares: [programStudiController.DeleteProgramStudi]}
        
    ]
    return aRoutes
}