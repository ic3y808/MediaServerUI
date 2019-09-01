var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");

/**

 * @route GET /user/users
 * @produces application/json 
 * @consumes application/json 
 * @group user - User API
 * @returns {Array.<User>} 200 - Returns an array of users.
 * @security ApiKeyAuth
 */
router.get("/users", function (req, res) {
  res.json({ users: res.locals.db.prepare("SELECT id, type, username, registered, last_login, now_playing FROM Users").all() });
});

/**
* @route GET /user/login
* @produces application/json 
* @consumes application/json 
* @group user - User API
* @param {string} username.query required username of user.
* @param {string} password.query required password for the user.
* @returns {string} 200 - Returns a login result.
* @security ApiKeyAuth
*/
router.get("/login", function (req, res) {
  var username = req.query.username;
  var password = req.query.password;
  var existingUser = res.locals.db.prepare("SELECT * from Users WHERE username=? AND password=?").get(username, password);
  if (existingUser) {
    res.locals.db.prepare("UPDATE Users SET last_login=? WHERE id=?").run(new Date().toISOString(), existingUser.id);
    res.json(new structures.StatusResult("success"));
  } else {
    res.json(new structures.StatusResult("failed"));
  }
});

/**
 * @route PUT /user/create
 * @produces application/json 
 * @consumes application/json 
 * @group user - User API
 * @param {string} type.query required type of user.
 * @param {string} username.query required username of user.
 * @param {string} password.query required password for the user.
 * @returns {User} 200 - The newly created user is returned
 * @security ApiKeyAuth
 */
router.put("/create", function (req, res) {
  if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    var type = req.query.type;
    var username = req.query.username;
    var password = req.query.password;

    try {
      res.locals.db.prepare("INSERT INTO Users (type,username,password, registered) VALUES (?,?,?,?)").run(type, username, password, new Date().toISOString());
      res.send(new structures.StatusResult("success")).end();
    } catch (err) {
      res.locals.error(err);
      res.send(new structures.StatusResult("error")).end();
    }
  } else { return res.sendStatus(401); }
});

/**
 * @route PUT /user/checkin
 * @produces application/json 
 * @consumes application/json 
 * @group user - User API
 * @param {string} username.query required username of user.
 * @returns {string} 200 - a message for success
 * @security ApiKeyAuth
 */
router.put("/checkin", function (req, res) {
  var username = req.query.username;
  try {
    res.locals.db.prepare("UPDATE Users SET last_login=? WHERE username=?").run(new Date().toISOString(), username);
    res.send(new structures.StatusResult("success")).end();
  } catch (err) {
    res.locals.error(err);
    res.send(new structures.StatusResult("error")).end();
  }
});

/**
 * @route DELETE /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query.required ID of the playlist
 * @returns {Playlist} 200 - The updated playlist is returned or a error is presented if the playlist is deleted/not found
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete("/", function (req, res) {
  var id = req.query.id;
  var existingUser = res.locals.db.prepare("SELECT * from Users WHERE id=?").all(id);
  if (existingUser.length > 0) {
    existingUser.forEach((track) => {
      res.locals.db.prepare("DELETE FROM Users WHERE id=?").run(id);
    });
  }
  res.send(new structures.StatusResult("Deleted"));
});

module.exports = router;