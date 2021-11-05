const express = require('express')
const router = express.Router()
const { getContacts, getContactById, addContact, deleteContact, updateContact, updateStatusContact, getContactsByUser} = require('../../controllers/contacts')
const { validateContact, validateId, validateStatusContact } = require('./validations')
const authenticate = require('../../middlewares/autenticate')
const controllerWrapper = require('../../middlewares/controllerWrapper')

// router.get('/', getContacts)

router.get('/:contactId', authenticate, validateId, controllerWrapper(getContactById))

router.post('/', authenticate, validateContact, controllerWrapper(addContact))

router.get('/', authenticate, controllerWrapper(getContactsByUser))

router.delete('/:contactId', authenticate, validateId, controllerWrapper(deleteContact))

router.put('/:contactId', authenticate, validateId, validateContact, controllerWrapper(updateContact))

router.patch('/:contactId/favorite', authenticate, [validateId, validateStatusContact], controllerWrapper(updateStatusContact))

module.exports = router
