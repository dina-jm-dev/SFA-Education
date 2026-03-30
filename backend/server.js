const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/uploads', express.static('uploads'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/chapters', require('./routes/chapterRoutes'))
app.use('/api/lessons', require('./routes/lessonRoutes'))
app.use('/api/enrollments', require('./routes/enrollmentRoutes'))
app.use('/api/upload', require('./routes/uploadRoutes'))

app.listen(3000, () => console.log('Server running on port 3000'))