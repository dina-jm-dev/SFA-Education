const db = require('../config/db')

exports.createLesson = async (req, res) => {
    const { title, duration, chapterId, profile_picture } = req.body
    try {
        await db.query(`INSERT INTO lesson (title, duration, chapterId, profile_picture) VALUES (?, ?, ?, ?)`, 
        [title, duration, chapterId, profile_picture || null])
        res.json({ message: 'Lesson created' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error creating lesson' }) 
    }
}

exports.updateLesson = async (req, res) => {
    const { title, duration, profile_picture } = req.body
    try {
        await db.query(`UPDATE lesson SET title = ?, duration = ?, profile_picture = ? WHERE id = ?`, 
        [title, duration, profile_picture || null, req.params.id])
        res.json({ message: 'Lesson updated' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error updating lesson' }) 
    }
}

exports.deleteLesson = async (req, res) => {
    try {
        await db.query(`DELETE FROM lesson WHERE id = ?`, [req.params.id])
        res.json({ message: 'Lesson deleted' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error deleting lesson' }) 
    }
}
