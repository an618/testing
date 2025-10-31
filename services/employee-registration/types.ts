export interface EmployeeRegistrationRequest {
  organizationName: string;
  organizationSlug: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  emailDomain: string;
  description: string;
}

export interface EmployeeRegistrationResponse {
  id: string;
  message: string;
  // Add other response fields as needed
}
