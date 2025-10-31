// Response interface for Finch URL
export interface FinchUrlResponse {
  url: string;
}

// Request interface for Finch callback
export interface FinchCallbackRequest {
  code: string;
}

// Response interface for Finch callback
export interface FinchCallbackResponse {
  access_token?: boolean;
  message?: string;
}
