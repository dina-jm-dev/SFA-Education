const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    const { identifier, password } = req.body

    try {
        const [rows] = await db.query(
            'SELECT * FROM utilisateurs WHERE email = ? OR username = ?',
            [identifier, identifier]
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24h
        })

        // Don't send password back
        const { password: _, ...userWithoutPassword } = user
        res.json({ message: 'Connecté avec succès', user: userWithoutPassword })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Erreur lors de la connexion' })
    }
}

exports.register = async (req, res) => {
    const { name, username, email, password, role, profile_picture } = req.body

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
            'INSERT INTO utilisateurs (name, username, email, password, role, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
            [name, username, email, hashedPassword, role || 'Student', profile_picture || null]
        )

        const [newUser] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [result.insertId])

        const token = jwt.sign(
            { id: newUser[0].id, role: newUser[0].role },
            'SECRET_KEY',
            { expiresIn: '24h' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })

        const { password: _, ...userWithoutPassword } = newUser[0]
        res.status(201).json({ message: 'Inscrit avec succès', user: userWithoutPassword })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Erreur lors de l\'inscription' })
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token')
    res.json({ message: 'Déconnecté' })
}