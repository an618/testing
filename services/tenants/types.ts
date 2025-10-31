export interface Tenant {
  orgId: string;
  displayName: string;
}

export interface TenantResolveResponse {
  email: string;
  tenants: Tenant[];
}
