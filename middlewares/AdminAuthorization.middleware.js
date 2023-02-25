

const authorization = (req, res, next) => {
    const { token } = req.body;
    if (token.role == 'admin') {
        next()
    } else {
        res.status(401).send({ message: 'Access Denied' })
    }
}

module.exports = {
    authorization
}