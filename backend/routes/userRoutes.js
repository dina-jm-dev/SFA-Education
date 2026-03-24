const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const ctrl = require('../controllers/userController')

router.post('/', auth, roles('Administrator'), ctrl.createUser)
router.get('/', auth, roles('Administrator'), ctrl.getUsers)
router.delete('/:id', auth, roles('Administrator'), ctrl.deleteUser)

module.exports = router