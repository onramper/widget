export type document =
  | 'passport'
  | 'national_identity_card'
  | 'residence_permit'
  | 'driving_licence';

export function generateUnexpectedDocumentErrorMessage(doc: string): string {
  return `Encountered document id ${doc} in Moonpay, which the code is not ready to handle`;
}
