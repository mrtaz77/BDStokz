const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,}$/;
const NID_REGEX = /^\d{3}-\d{2}-\d{4}$/;
const CONTACT_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const validateEmail = async (email) => (EMAIL_REGEX.test(email));

const validateNid = async (nid) => (NID_REGEX.test(nid));

const validateContact = async (contact) => (CONTACT_REGEX.test(contact));

module.exports = {
    validateEmail, 
    validateNid, 
    validateContact
};

