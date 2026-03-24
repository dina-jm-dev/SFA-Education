const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const ctrl = require('../controllers/courseController')

// accessible à tous (public)
router.get('/', ctrl.getCourses)
router.get('/:id', ctrl.getCourseById)

// Admin + Teacher (protégé)
router.post('/', auth, roles('Administrator', 'Teacher'), ctrl.createCourse)

router.delete('/:id', auth, roles('Administrator', 'Teacher'), ctrl.deleteCourse)

module.exports = router