'use strict'

module.exports = (app) => {
    const krsController = app.controller('krs')

    let aRoutes = [
        {method: 'get', route: '/', inits: [], middlewares: [krsController.getPagingKrs]},
        {method: 'post', route: '/', inits: [], middlewares: [krsController.AddKrs]},
        {method: 'get', route: '/:id', inits: [], middlewares: [krsController.getKrs]},
        {method: 'put', route: '/:id', inits: [], middlewares: [krsController.EditKrs]},
        {method: 'delete', route: '/:id', inits: [], middlewares: [krsController.DeleteKrs]}
        
    ]
    return aRoutes
}

'use strict'
