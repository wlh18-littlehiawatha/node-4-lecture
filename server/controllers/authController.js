const bcrypt = require('bcryptjs')


module.exports = {
   register: async (req, res) => {
      const db = req.app.get('db')

      const { email, password } = req.body

      const existingUser =await db.get_user_by_email([email])
// verified user did not exist
      if (existingUser[0]) {
         return res.status(409).send('User already exists')
      }

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      const newUser = await db.create_user([email, hash])

      delete newUser[0].hash

      req.session.user = newUser[0]

      res.status(200).send(req.session.user)
   }, 
   login: (req, res) => {},
   logout: (req, res) => {}
}