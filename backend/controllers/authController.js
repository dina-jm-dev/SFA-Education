const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const [rows] = await db.query(
            'SELECT * FROM utilisateurs WHERE email = ?',
            [email]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        const user = rows[0]
        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            'SECRET_KEY',
            { expiresIn: '24h' }
        )

        // Don't send password back
        const { password: _, ...userWithoutPassword } = user
        res.json({ token, user: userWithoutPassword })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Erreur lors de la connexion' })
    }
}

exports.register = async (req, res) => {
    const { name, username, email, password, role } = req.body

    try {
        // Check if user already exists
        const [existing] = await db.query(
            'SELECT id FROM utilisateurs WHERE email = ? OR username = ?',
            [email, username]
        )

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await db.query(
            'INSERT INTO utilisateurs (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, username, email, hashedPassword, role || 'Student']
        )

        const [newUser] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [result.insertId])

        const token = jwt.sign(
            { id: newUser[0].id, role: newUser[0].role },
            'SECRET_KEY',
            { expiresIn: '24h' }
        )

        const { password: _, ...userWithoutPassword } = newUser[0]
        res.status(201).json({ token, user: userWithoutPassword })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Erreur lors de l\'inscription' })
    }
}