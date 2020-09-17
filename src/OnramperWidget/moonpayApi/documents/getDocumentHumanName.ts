import {
  document,
  generateUnexpectedDocumentErrorMessage,
} from './documentType';

export default function (doc: document) {
  switch (doc) {
    case 'passport':
      return 'Passport';
    case 'national_identity_card':
      return 'National Identity Card';
    case 'residence_permit':
      return 'Residence Card';
    case 'driving_licence':
      return "Driver's License";
    default:
      throw new Error(generateUnexpectedDocumentErrorMessage(doc)); // This is actually an internal error, should be caught and processed as such
  }
}
