const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) return res.status(403).json({ message: 'Accès refusé' })

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY')
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ message: 'Token invalide' })
    }
}