const {findBy} = require('../users/user-modal');

function checkUsername() {
    return async (req, res, next) => {
      try {
        const checkName = await findBy({username: req.body.username})
        if(checkName.length > 0) {
          res.status(400).json({message: 'username taken'})
        } else {
          next()
        }
      } catch (err) {
        next(err)
      }
    }
  }


  module.exports = {
    checkUsername
  }