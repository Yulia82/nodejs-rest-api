const express = require('express')
const router = express.Router()
const { validateAuth, validateEmail } = require('./authvalidate')
const authenticate = require('../../middlewares/autenticate')
const upload = require('../../middlewares/upload')
const controllerWrapper = require('../../middlewares/controllerWrapper')
const { registration, login, logout, getCurrentUser, uploadAvatar, verifyUser, repeatEmailVerifyUser} = require('../../controllers/auth')


router.post('/signup', validateAuth, controllerWrapper(registration))

router.get('/verify/:verifyToken', controllerWrapper(verifyUser))

router.post('/verify', validateEmail, controllerWrapper(repeatEmailVerifyUser))

router.post('/login', validateAuth, controllerWrapper(login))

router.post('/logout', authenticate, controllerWrapper(logout))

router.get('/current', authenticate, controllerWrapper(getCurrentUser))

router.patch('/avatar', authenticate, upload.single('avatar'), controllerWrapper(uploadAvatar))


module.exports = router