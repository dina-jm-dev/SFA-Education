const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))

app.listen(3000, () => console.log('Server running on port 3000'))