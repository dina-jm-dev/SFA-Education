const db = require('../config/db')
const bcrypt = require('bcryptjs')

// CREATE
exports.createUser = async (req, res) => {
    const { name, username, email, password, role, profile_picture } = req.body

    const hash = await bcrypt.hash(password, 10)

    await db.query(
        `INSERT INTO utilisateurs (name, username, email, password, role, profile_picture)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [name, username, email, hash, role, profile_picture || null]
    )

    res.json({ message: 'User created' })
}

// READ
exports.getUsers = async (req, res) => {
    const [users] = await db.query('SELECT * FROM utilisateurs')
    res.json(users)
}

// DELETE
exports.deleteUser = async (req, res) => {
    await db.query(
        'DELETE FROM utilisateurs WHERE id = ?',
        [req.params.id]
    )

    res.json({ message: 'User deleted' })
}