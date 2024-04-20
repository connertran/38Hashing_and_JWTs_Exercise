const Router = require("express").Router;
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const ExpressError = require("../expressError");

const router = new Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let users = await User.all();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    let reqUsername = req.params.username;
    let userDb = await User.get(reqUsername);

    return res.json({ user: userDb });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
  try {
    let reqUsername = req.params.username;
    let results = await User.messagesTo(reqUsername);
    return res.json({ messages: results });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get(
  "/:username/from",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let reqUsername = req.params.username;
      let results = await User.messagesFrom(reqUsername);
      return res.json({ messages: results });
    } catch (e) {
      return next(e);
    }
  }
);
module.exports = router;
