export interface TrusteeConfirmationRequest {
  isTrustee: boolean;
  isAgree: boolean;
  isAuthorize: boolean;
  trusteeTitle: string;
  trusteeLegalName: string;
  trusteeEmail: string;
}

export interface TrusteeConfirmationResponse {
  success: boolean;
  id: string;
  message?: string;
}

export interface TrusteeSignatureRequest {
  firstName: string;
  lastName: string;
  signatureText: string;
  isDocumentsRead: boolean;
  isChangesUnderstood: boolean;
}

export interface TrusteeSignatureResponse {
  success: boolean;
  message?: string;
}
