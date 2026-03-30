const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const ctrl = require('../controllers/chapterController')

router.post('/', auth, roles('Administrator', 'Teacher'), ctrl.createChapter)
router.put('/:id', auth, roles('Administrator', 'Teacher'), ctrl.updateChapter)
router.delete('/:id', auth, roles('Administrator', 'Teacher'), ctrl.deleteChapter)

module.exports = router
