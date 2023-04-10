

const AdminAuth = (req, res, next) => {
    const { token } = req.body;
    if (token.role == 'admin') {
        next()
    } else {
        res.status(401).send({ message: 'Access Denied' })
    }
}


const UserAuth = (req, res, next) => {
    const {token} = req.body;
    if(token.role == 'user') {
        next()
    } else {
        return res.status(401).send({message: 'Access Denied'})
    }
}

module.exports = {
    AdminAuth, UserAuth
}