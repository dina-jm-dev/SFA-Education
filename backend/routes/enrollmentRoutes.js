const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const ctrl = require('../controllers/enrollmentController')

router.post('/', auth, roles('Student', 'Administrator'), ctrl.enrollCourse)
router.get('/my-courses', auth, roles('Student', 'Administrator'), ctrl.getMyCourses)

module.exports = router
