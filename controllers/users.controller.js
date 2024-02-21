const User = require("../models/user.model");
const bcrypt = require('bcrypt')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
    res.render('users/signup')
};


module.exports.doCreate = (req, res, next) => {
    const user = { email: req.body.email, password: req.body.password };

    bcrypt.hash(req.body.password, 10)
        .then(function (hash) {
            User.create({ email: req.body.email, password: hash })
            .then((user) => res.redirect(`/users/${user.id}`))
            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError) {
                    res
                        .status(400)
                        .render("users/signup", { user, error: error.errors});
                } else {
                    next(error);
                }
            });
    })
        .catch(next);
};

module.exports.detail = (req, res, next) => {
    const { id } = req.params
    User.findById(id)
        .then((user) => {
            if (!user) {
                next(createError(404, 'User not found'))
            } else {
                res.render('users/profile', { user })
            }
        })
        .catch((error) => next(error))
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