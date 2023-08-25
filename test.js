const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,}$/;
const NID_REGEX = /^\d{3}-\d{2}-\d{4}$/;
const CONTACT_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const validateEmail = (email) => (EMAIL_REGEX.test(email));

const validateNid = (nid) => (NID_REGEX.test(nid));

const validateContact = (contact) => (CONTACT_REGEX.test(contact));



