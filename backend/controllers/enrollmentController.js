const db = require('../config/db')

exports.enrollCourse = async (req, res) => {
    const { courseId } = req.body
    const studentId = req.user.id
    try {
        const [existing] = await db.query(`SELECT * FROM enrollment WHERE studentId = ? AND courseId = ?`, [studentId, courseId])
        if (existing.length > 0) return res.status(400).json({ message: 'Already enrolled' })

        await db.query(`INSERT INTO enrollment (studentId, courseId) VALUES (?, ?)`, [studentId, courseId])
        res.json({ message: 'Successfully enrolled in course' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error enrolling in course' }) 
    }
}

exports.getMyCourses = async (req, res) => {
    const studentId = req.user.id
    try {
        const [courses] = await db.query(`
            SELECT cours.*, utilisateurs.name AS teacherName 
            FROM cours 
            JOIN enrollment ON cours.id = enrollment.courseId 
            LEFT JOIN utilisateurs ON cours.teacherId = utilisateurs.id
            WHERE enrollment.studentId = ?`, [studentId])
        res.json(courses)
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error fetching enrolled courses' }) 
    }
}
