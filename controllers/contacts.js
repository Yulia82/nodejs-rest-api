const { NotFound } = require('http-errors')
const Contacts = require('../repository/contactsDB')
const { sendSuccessRes } = require('../helpers/sendSuccessRes')


const getContactById = async (req, res) => {
  const {_id} = req.user
  const contact = await Contacts.getContactById(req.params.contactId, _id)
  if (contact) {
    return sendSuccessRes(res, { contact })
  }
  
  throw new NotFound("Not Found contact")
}

const addContact = async (req, res) => {
  const {_id} = req.user
  const contact = await Contacts.addContact({...req.body, owner: _id})
  sendSuccessRes(res, { contact }, 201)
}

const getContactsByUser = async (req, res) => {
  const {_id} = req.user
  // console.log(req.method)
  const allUserContacts = await Contacts.getContactsByUser(_id)
  return sendSuccessRes(res, { allUserContacts })
}

const deleteContact = async (req, res) => {
  const {_id} = req.user
  const contact = await Contacts.removeContact(req.params.contactId, _id)
  if (contact) {
    return sendSuccessRes(res, { contact })
  }

  throw new NotFound("Not Found contact")
}

const updateContact = async (req, res, next) => {
  const {_id} = req.user
  const contact = await Contacts.updateContact(req.params.contactId, req.body, _id)
  if (contact) {
    return sendSuccessRes(res, { contact })
  }

  throw new NotFound("Not Found contact")
}

const updateStatusContact = async (req, res) => {
  const {_id} = req.user
  const contact = await Contacts.updateContact(req.params.contactId, req.body, _id)
  if (contact) {
    return sendSuccessRes(res, { contact })
  }

  throw new NotFound("Not Found contact")
}

module.exports = {
    getContactById,
    addContact,
    deleteContact,
    updateContact,
    updateStatusContact,
    getContactsByUser,
}