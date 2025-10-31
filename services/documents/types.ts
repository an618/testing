/**
 * TypeScript types for Documents service
 */

export interface Document {
  id: string;
  tenantId: string;
  status: string;
  fileKey: string;
  uploadedBy: string;
  createdAt: string;
  downloadUrl: string;
}

export interface DocumentsListResponse {
  documents: Document[];
}

export interface DocumentsListParams {
  tenantId?: string;
  status?: string;
  uploadedBy?: string;
}
