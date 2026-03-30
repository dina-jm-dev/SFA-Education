const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const ctrl = require('../controllers/lessonController')

router.post('/', auth, roles('Administrator', 'Teacher'), ctrl.createLesson)
router.put('/:id', auth, roles('Administrator', 'Teacher'), ctrl.updateLesson)
router.delete('/:id', auth, roles('Administrator', 'Teacher'), ctrl.deleteLesson)

module.exports = router
