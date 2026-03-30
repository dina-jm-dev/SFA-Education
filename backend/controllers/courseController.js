const db = require('../config/db')

// CREATE (Admin + Teacher)
exports.createCourse = async (req, res) => {
    const { title, description, duration, profile_picture, chapters } = req.body
    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const [courseResult] = await connection.query(
            `INSERT INTO cours (title, description, duration, teacherId, profile_picture)
             VALUES (?, ?, ?, ?, ?)`,
            [title, description, duration, req.user.id, profile_picture || null]
        )
        const courseId = courseResult.insertId

        if (chapters && Array.isArray(chapters)) {
            for (const chapter of chapters) {
                const [chapterResult] = await connection.query(
                    `INSERT INTO chapter (title, duration, courseId)
                     VALUES (?, ?, ?)`,
                    [chapter.title, chapter.duration || '00:00', courseId]
                )
                const chapterId = chapterResult.insertId

                if (chapter.lessons && Array.isArray(chapter.lessons)) {
                    for (const lesson of chapter.lessons) {
                        await connection.query(
                            `INSERT INTO lesson (title, duration, chapterId, profile_picture)
                             VALUES (?, ?, ?, ?)`,
                            [lesson.title, lesson.duration || '00:00', chapterId, lesson.profile_picture || null]
                        )
                    }
                }
            }
        }

        await connection.commit()
        res.json({ message: 'Course created with chapters and lessons', courseId })
    } catch (error) {
        await connection.rollback()
        console.error('Error creating complex course:', error)
        res.status(500).json({ message: 'Error creating course' })
    } finally {
        connection.release()
    }
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