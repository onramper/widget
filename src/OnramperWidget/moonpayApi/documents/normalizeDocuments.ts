import {
  document,
  generateUnexpectedDocumentErrorMessage,
} from './documentType';
import InternalError from '../errors/ApiError';

export default function normalizeDocuments(
  docs: Array<document>
): Array<
  'passport' | 'nationalIdentityCard' | 'residenceCard' | 'driverLicense'
> {
  return docs.map((d) => {
    switch (d) {
      case 'passport':
        return 'passport';
      case 'national_identity_card':
        return 'nationalIdentityCard';
      case 'residence_permit':
        return 'residenceCard';
      case 'driving_licence':
        return 'driverLicense';
      default:
        throw new InternalError(generateUnexpectedDocumentErrorMessage(d));
    }
  });
}
