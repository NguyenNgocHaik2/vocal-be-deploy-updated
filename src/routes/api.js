import express from "express"
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction"
import vocalController from '../controllers/vocalController'
import apiController from '../controllers/user/apiController'
import userController from '../controllers/user/userController'
import roleController from '../controllers/user/roleController'
import groupController from '../controllers/user/groupController'
import levelController from '../controllers/levelController'

const router = express.Router()

const initApiRoutes = (app) => {
    // rest full API
    // CRUD : Create - Read - Update - Delete => POST - GET - PUT - DELETE
    router.all('*', checkUserJWT, checkUserPermission); // check middleware..

    router.post('/user/register', apiController.handleApiRegister)
    router.post('/user/login', apiController.handleApiLogin)
    router.post('/user/logout', apiController.handleApiLogout)

    // user routes
    router.get('/user/account', userController.getUserAccount)
    router.get('/user/read', userController.readFunc)
    router.post('/user/create', userController.crateFunc)
    router.put('/user/update', userController.updateFunc)
    router.delete('/user/delete', userController.deleteFunc)

    // roles routes
    router.get('/role/read', roleController.readFunc)
    router.post('/role/create', roleController.crateFunc)
    router.put('/role/update', roleController.updateFunc)
    router.delete('/role/delete', roleController.deleteFunc)
    router.get('/role/by-group/:groupId', roleController.getRoleByGroup)
    router.post('/role/assign-to-group', roleController.assignRoleToGroup)

    // group routes
    router.get('/group/read', groupController.readFunc)


    // ==========================================================================
    // level routes
    router.get('/level/read', levelController.readFunc)
    router.post('/level/create', levelController.crateFunc)
    router.put('/level/update', levelController.updateFunc)
    router.delete('/level/delete', levelController.deleteFunc)
    
    // vocalbulary routes
    router.get('/vocal/read', vocalController.readFunc)
    router.post('/vocal/create', vocalController.createFunc)
    router.put('/vocal/update', vocalController.updateFunc)
    router.delete('/vocal/delete', vocalController.deleteFunc)

    // user_vocal routes
    router.post('/vocal/assign-to-user', vocalController.assignVocalToUser)
    router.get('/vocal/by-user/read', vocalController.getVocalByUser)
    router.delete('/vocal/delete-assign-to-user', vocalController.deleteAssignVocalToUser)

    return app.use("/api/v1", router)
}

export default initApiRoutes