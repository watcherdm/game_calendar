const express = require('express')
const app = express()
const fs = require('fs')
const crypto = require('crypto')
const {v4: genuuid} = require('uuid')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const nodemailer = require('nodemailer')
const Sequelize = require('sequelize')
const {DataTypes, Op} = Sequelize

const sqliz = new Sequelize('watcher_game_calendar', 'root', 'test1234', {
  host: 'localhost',
  dialect: 'mysql',
})
sqliz
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Character = require('./models/character')(sqliz, DataTypes)
const Game = require('./models/game')(sqliz, DataTypes)
const ResetToken = require('./models/resettoken')(sqliz, DataTypes)
const Role = require('./models/role')(sqliz, DataTypes)
const Rsvp = require('./models/rsvp')(sqliz, DataTypes)
const RsvpStatus = require('./models/rsvpstatus')(sqliz, DataTypes)
const User = require('./models/user')(sqliz, DataTypes)
const UserRole = require('./models/userrole')(sqliz, DataTypes)

const transportConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}

const transport = nodemailer.createTransport(transportConfig)

const make_query = require('./setup_db')

app.use(express.json())

app.use(session({
  genid: (req) => {return genuuid()},
  secret: 'wicked taco',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    console.log('serializing passport user')
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log('trying to get passport user')
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {
    console.log(`passport engaged ${username}, ${password}`)
    User.findOne({where: {email: req.body.email}}).then((err, user) => {
        if (err) { 
            console.error(err)
            return done(err) 
        }
        if (!user) {
            console.error(`No user found for email ${username}`)
            return done(null, false, {message: 'No such user'})
        }

        if (user.salt == null) {
            console.error(`No salt found for email ${username}`)
            return done(null, false, {message: 'Invalid Credentials'})
        }
        if (!user.validPassword(password)) {
            console.error(`Invalid password for email ${username}`)
            return done(null, false, {message: "Invalid Credentials"})
        }
        return done(null, user)
    })
}))

app.get('/api', async (req, res) => {
  console.log(Role.findOne)
  try {
    response = {
      roles: await Role.count(),
      users: await User.count(),
      userroles: await UserRole.count(),
      characters: await Character.count(),
      games: await Game.count(),
      rsvps: await Rsvp.count(),
      resetTokens: await ResetToken.count(),
      "forgot-password": '/api/forgot-password',
      "reset-password": '/api/reset-password'
    }
    return res.json(response)
  } catch(e) {
    return res.json({error:e.message})
  }
})

app.get('/api/session', (req, res) => {
  res.json({session: req.session})
})

app.post('/api/forgot-password', async (req, res, next) => {
  console.log(req)
  const email = await User.findOne({where: {email: req.body.email}})
  if (email == null) {
    console.log('Someone tried to forget password, but we don\'t know this email address')
    return res.json({status: 'ok'})
  }

  await ResetToken.update({
    used: 1
  }, {
    where: {
      email: req.body.email
    }
  })

  const token = genuuid()

  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + 1/24)

  await ResetToken.create({
    email: req.body.email,
    expiration: expireDate,
    token: token,
    used: 0
  })

  const message = {
    from: process.env.SENDER_ADDRESS,
    to: req.body.email,
    replyTo: process.env.REPLYTO_ADDRESS,
    subject: process.env.FORGOT_PASS_SUBJECT_LINE,
    text: `To reset your pass, please click the link below.\n\nhttps://${process.env.DOMAIN}/reset-password?token=${token}&email=${req.body.email}`
  }

  transport.sendMail(message, (err, info) => {
    console.log('Mail Sending results')
    if (err) { console.log(err)}
    else {console.log(info)}
  })

  return res.json({status:'ok'})
})

app.get('/api/reset-password', async (req, res, next) => {
  await ResetToken.destroy({
    where: {
      expiration: { [Op.lt]: Sequelize.fn('CURDATE') }
    }
  })

  const record = await ResetToken.findOne({
    where: {
      email: req.query.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
      token: req.query.token,
      used: 0
    }
  })

  if (record == null) {
    return res.json({
      message: 'Token has expired. Please try password reset again.',
      showForm: false
    })
  }

  return res.json(record)
})

const isValidPassword = (password) => {
  const valid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/g
  return password.match(valid)
}

app.post('/api/reset-password', async (req, res, next) => {
  console.log(req.body)
  if (req.body.password !== req.body.confirm) {
    return res.json({
      status: 'error',
      message: 'Passwords do not match. Please try again.'
    })
  }

  if (!isValidPassword(req.body.password)) {
    return res.json({
      status: 'error',
      message: 'Password does not meet requirements. Please try again.'
    }, 400)
  }

  const record = await ResetToken.findOne({
    where: {
      email: req.body.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
      token: req.body.token,
      used: 0
    }
  })

  if (record == null) {
    return res.json({
      status: 'error',
      message: 'Token not found. Please try the reset password process again.'
    })
  }

  const upd = await ResetToken.update({
    used: 1
  }, {
    where: {
      email: req.body.email
    }
  })

  var newSalt = crypto.randomBytes(64).toString('hex');
  var newPassword = crypto.pbkdf2Sync(req.body.password, newSalt, 10000, 64, 'sha512').toString('base64');

  await User.update({
    password: newPassword,
    salt: newSalt
  }, {
    where: {
      email: req.body.email
    }
  })

  return res.json({status: 'ok', message: 'Password reset. Please login with your new password.'})
})

app.post('/api/login', (req, res, next) => {
    console.log('got login request')
    return passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/login',
        failureFlash: true
    })
})

app.post('/api/roles', (req, res) => {
})

app.get('/api/roles', (req, res) => {
})

app.post('/api/users', (req, res) => {

})

app.get('/api/users', (req, res) => {
})

app.listen(3001, () => {
  console.log('exampled app listening on 3001')
})
