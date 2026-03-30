const db = require('../config/db')

// CREATE (Admin + Teacher)
exports.createCourse = async (req, res) => {
    const { title, description, duration, profile_picture } = req.body

    await db.query(
        `INSERT INTO cours (title, description, duration, teacherId, profile_picture)
     VALUES (?, ?, ?, ?, ?)`,
        [title, description, duration, req.user.id, profile_picture || null]
    )

    res.json({ message: 'Course created' })
}

// READ ALL
exports.getCourses = async (req, res) => {
    const [courses] = await db.query(`
    SELECT cours.*, utilisateurs.name AS teacherName
    FROM cours
    LEFT JOIN utilisateurs ON cours.teacherId = utilisateurs.id
  `)

    res.json(courses)
}

// READ ONE (with chapters and lessons)
exports.getCourseById = async (req, res) => {
    const { id } = req.params

    try {
        const [courseRows] = await db.query(
            `SELECT cours.*, utilisateurs.name AS teacherName 
             FROM cours 
             LEFT JOIN utilisateurs ON cours.teacherId = utilisateurs.id 
             WHERE cours.id = ?`,
            [id]
        )

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Course not found' })
        }

        const course = courseRows[0]

        // Fetch chapters
        const [chapters] = await db.query(
            'SELECT * FROM chapter WHERE courseId = ?',
            [id]
        )

        // Fetch lessons for each chapter
        for (let chapter of chapters) {
            const [lessons] = await db.query(
                'SELECT * FROM lesson WHERE chapterId = ?',
                [chapter.id]
            )
            chapter.lessons = lessons
        }

        course.chapters = chapters

        res.json(course)
    } catch (error) {
        console.error('Error fetching course:', error)
        res.status(500).json({ message: 'Error fetching course details' })
    }
}

// UPDATE
exports.updateCourse = async (req, res) => {
    const { title, description, duration, profile_picture, teacherId } = req.body
    try {
        await db.query(
            'UPDATE cours SET title = ?, description = ?, duration = ?, profile_picture = ?, teacherId = ? WHERE id = ?',
            [title, description, duration, profile_picture || null, teacherId || null, req.params.id]
        )
        res.json({ message: 'Course updated' })
    } catch (error) {
        console.error('Error updating course:', error)
        res.status(500).json({ message: 'Error updating course' })
    }
}

// DELETE
exports.deleteCourse = async (req, res) => {
    await db.query(
        'DELETE FROM cours WHERE id = ?',
        [req.params.id]
    )

    res.json({ message: 'Course deleted' })
}