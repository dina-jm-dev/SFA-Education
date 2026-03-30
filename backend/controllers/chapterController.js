const db = require('../config/db')

exports.createChapter = async (req, res) => {
    const { title, duration, courseId, profile_picture } = req.body
    try {
        await db.query(`INSERT INTO chapter (title, duration, courseId, profile_picture) VALUES (?, ?, ?, ?)`, 
        [title, duration, courseId, profile_picture || null])
        res.json({ message: 'Chapter created' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error creating chapter' }) 
    }
}

exports.updateChapter = async (req, res) => {
    const { title, duration, profile_picture } = req.body
    try {
        await db.query(`UPDATE chapter SET title = ?, duration = ?, profile_picture = ? WHERE id = ?`, 
        [title, duration, profile_picture || null, req.params.id])
        res.json({ message: 'Chapter updated' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error updating chapter' }) 
    }
}

exports.deleteChapter = async (req, res) => {
    try {
        await db.query(`DELETE FROM chapter WHERE id = ?`, [req.params.id])
        res.json({ message: 'Chapter deleted' })
    } catch (e) { 
        console.error(e)
        res.status(500).json({ message: 'Error deleting chapter' }) 
    }
}
