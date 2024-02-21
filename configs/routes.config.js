const express = require("express");
const users = require("../controllers/users.controller");
const home = require("../controllers/home.controller");

const router = express.Router();

router.get("/", home.home);

router.get('/signup', users.create);
router.post('/signup', users.doCreate);

router.get('/users/:id', users.detail);

router.get('/users/:id/edit', users.edit);
router.post('/users/:id/edit', users.doEdit);

router.post('/users/:id/delete', users.delete)

module.exports = router;
