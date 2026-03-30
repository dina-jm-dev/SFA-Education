const router = require('express').Router()
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'))
    }
})

const upload = multer({ storage: storage })

router.post('/', auth, roles('Administrator', 'Teacher'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }
    res.json({ url: `/uploads/${req.file.filename}` })
})

module.exports = router
