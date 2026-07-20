export type OidcConfiguration = {
  issuer: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
};

export type AuthenticatedPrincipal = {
  subject: string;
  email?: string;
  displayName?: string;
  roles: string[];
};

/** OIDC-ready boundary. A concrete adapter is intentionally deferred. */
export interface IdentityProvider {
  getConfiguration(): OidcConfiguration;
  verifyAccessToken(token: string): Promise<AuthenticatedPrincipal>;
}
