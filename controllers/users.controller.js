const User = require("../models/user.model");
const createError = require('http-errors')
const mongoose = require('mongoose')
const { sessions } = require('../middlewares/auth.middleware')



module.exports.create = (req, res, next) => {
    res.render('users/signup')
};


module.exports.doCreate = (req, res, next) => {
    const user = { email: req.body.email, password: req.body.password };

    User.create(user)
        .then((user) => res.redirect('/login'))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).render("users/signup", { user, error: error.errors});
            } else {
                next(error);
            }
        });
};

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            user.checkPassword(req.body.password).then((match) => {
                if (match) {
                    const sessionId = Math.random().toString(36).substring(2, 15)
                    sessions.push({ sessionId, userId: user.id})

                    res.setHeader('Set-Cookie', `sessionId=${sessionId}`)
                    res.redirect('/profile')
                } else {
                    res.redirect('/login')
                }
            })
        })
        .catch(next)
}

module.exports.profile = (req, res, next) => {
    res.render('users/profile')
}

module.exports.edit = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                next(createError(404, 'User not found'))
            } else {
                res.render('users/edit', { user })
            }
        })
        .catch((error) => next(error))
};

module.exports.doEdit = (req, res, next) => {

    User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true})
        .then((user) => {
            if (!user) {
                next(createError(404, 'User not found'))
            } else {
                res.redirect(`/users/${user.id}`, { user })
            }
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                const user = req.body;
                user.id = req.params.id;
                res
                    .status(400)
                    .render("users/edit", { user: req.body, error: error.errors});
            } else {
                next(error);
            }
        });
};

module.exports.delete = (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then((user) => {
            if (!user) {
                next(createError(404, 'User not found'))
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => next (error));
};