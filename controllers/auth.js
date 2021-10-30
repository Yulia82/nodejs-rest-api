const path = require('path')
const mkdirp = require('mkdirp')
const { Conflict, BadRequest, NotFound } = require('http-errors')
const User = require('../model/user')
const Users = require('../repository/usersDB')
const { sendSuccessRes } = require('../helpers/sendSuccessRes')
const UploadService = require('../services/upload-file')

// const sendEmail = require('../helpers/sendGridEmail')
const sendEmail = require('../helpers/sendEmailNodemailer')


const registration = async (req, res) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    throw new Conflict('Email is already exist')
  }

  const newUser = await Users.create({email, password})

  const data = {
    to: email,
    subject: `Подтверждение ${email} при регистрации на сайте...`,
    html: `
        <a href="http://localhost:3000/api/users/verify/${newUser.verifyToken}" target="_blank">Пожалуйста, подтвердитe почту</a>
      `
  }
  
  await sendEmail(data)
  
  return sendSuccessRes(res, 
    {
      message: "email send success"
    },
    201
  )
}

const verifyUser = async (req, res) => {
  const { verifyToken } = req.params
  const user = await Users.findByVerifyToken(verifyToken)

  if (!user) {
    throw new NotFound("Verify error")
  }

  await Users.updateVerifyToken(user._id, true, null)
  res.json({
        status: "success",
        code: 200,
        message: "Email verify success"
    })
}


const repeatEmailVerifyUser = async (req, res) => {
  const { email } = req.body
  const user = await Users.findByEmail(email)
  if (!user) {
    throw new NotFound("User not found")
  }

  const { verify, verifyToken } = user
  if (verify) {
    throw new BadRequest("Verification has already been passed")
  }

  const data = {
    to: email,
    subject: `Подтверждение ${email} при регистрации на сайте...`,
    html: `
        <a href="http://localhost:3000/api/users/verify/${verifyToken}" target="_blank">Пожалуйста, подтвердитe почту</a>
      `
  }
  
  await sendEmail(data)
  return sendSuccessRes(res, 
    {
      message: "Verification email sent"
    },
  )
}


const login = async (req, res) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  if (!user || !user.comparePassword(password)) {
    throw new BadRequest("Email or password is wrong")
  }

  if (!user.verify) {
    throw new BadRequest("Email not verify")
  }
    
  const token = user.createToken();
  await Users.updateToken(user._id, token)
  return sendSuccessRes(res, 
    {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarUrl: user.avatarUrl,
      }
    }
  )
}

const logout = async (req, res) => {
  const { _id } = req.user
  await Users.updateToken(_id, null)
  res.json({
    status: "success",
    code: 204,
    message: "No Content"
  });
}

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user
  sendSuccessRes(res, 
    {
      email,
      subscription,
    }
  )
}

const uploadAvatar = async (req, res) => {
  const id = String(req.user._id)
  const file = req.file

  const resultDestination = path.join(__dirname, '../', 'public/avatars', id)
  await mkdirp(resultDestination)

  const UploadServ = new UploadService(resultDestination)
  const avatarUrl = await UploadServ.save(id, file)
  const result = await Users.updateAvatar(id, avatarUrl)
  return sendSuccessRes(res, 
    {
      avatarUrl: result.avatarUrl,
    },
  )

}


module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  uploadAvatar,
  verifyUser,
  repeatEmailVerifyUser,
}
