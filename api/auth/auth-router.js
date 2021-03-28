const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../secret/secret') 
const {checkUsername} = require('./auth-middleware')
const User = require('../users/user-modal');

router.post('/register', checkUsername(), async (req, res, next) => {
  
  const credentials = req.body
  try{
    if(credentials) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
      
    const hash = bcrypt.hashSync(credentials.password, rounds)
      
    credentials.password = hash;
      
    const newUser = await User.add(credentials)
    res.status(201).json(newUser)
  
  } else {
    res.status(400).json({message: 'username and password required'})
  }
} catch (err) {
  res.status(500).json({message: err.message})
  next()
}
 });
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

router.post('/login', async (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
 const {username, password} = req.body
try{
  if(req.body) {
 const [newUser] = await User.findBy({username: username})
 if(newUser && bcrypt.compareSync(password, newUser.password)) {
   const token = buildToken(newUser)
   res.status(200).json({message: `welcome, ${username}`, token})
   } else {
     res.status(401).json({message: 'invalid credentials'})
   }
 }
} catch (err) {
  next(err)
}
});

function buildToken(user) {
  const payload = {
    username: user.username,
  };
  const config = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, jwtSecret, config)
}

module.exports = router;
