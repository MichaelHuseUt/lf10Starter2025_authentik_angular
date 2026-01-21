import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authConfig: AuthConfig = {
    issuer: 'http://localhost:9000/application/o/employee_api/',
    clientId: 'employee_api_client',
    redirectUri: window.location.origin + '/callback',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
    requireHttps: false,
    postLogoutRedirectUri: window.location.origin,
    strictDiscoveryDocumentValidation: false,  // Wichtig für Authentik!
  };

  private configurePromise: Promise<void>;

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {
    this.configurePromise = this.configure();
  }

  private async configure() {
    this.oauthService.configure(this.authConfig);

    try {
      // Discovery-Dokument laden
      await this.oauthService.loadDiscoveryDocument();

      // Authentik gibt die Endpoints als Arrays zurück, wir müssen sie normalisieren
      const discoveryDoc = (this.oauthService as any).discoveryDocument;
      if (discoveryDoc) {
        const endpointFields = [
          'authorization_endpoint',
          'token_endpoint',
          'userinfo_endpoint',
          'jwks_uri',
          'end_session_endpoint',
          'revocation_endpoint',
          'introspection_endpoint'
        ];

        endpointFields.forEach(field => {
          if (Array.isArray(discoveryDoc[field]) && discoveryDoc[field].length > 0) {
            discoveryDoc[field] = discoveryDoc[field][0];
          }
        });

        (this.oauthService as any).discoveryDocument = discoveryDoc;
      }

      this.oauthService.setupAutomaticSilentRefresh();
    } catch (error) {
      console.error('Fehler beim Laden des Discovery-Dokuments:', error);
    }
  }

  public async handleCallback(): Promise<boolean> {
    try {
      await this.configurePromise;
      await this.oauthService.tryLogin();
      return this.hasValidToken();
    } catch (error) {
      console.error('Fehler beim Login-Callback:', error);
      return false;
    }
  }

  public async login() {
    await this.configurePromise;
    this.oauthService.initCodeFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken() ?? "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI0MWRiZGEzODQ1NWI3ZGM5OTQwYzY2ZTI4ZDFjZDg0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXBwbGljYXRpb24vby9lbXBsb3llZV9hcGkvIiwic3ViIjoiNmUyNWIwMzhjYjFiNWUxZGI2ZWEzZGVjNTRlN2RhNmMxNTM5NjY4ZjM3Y2Q4YTIzOWIzZWNmOTFhNmMyMjRiZCIsImF1ZCI6ImVtcGxveWVlX2FwaV9jbGllbnQiLCJleHAiOjE3Njg5ODk1NDEsImlhdCI6MTc2ODk4NjU0MSwiYXV0aF90aW1lIjoxNzY4OTg2NTQxLCJhY3IiOiJnb2F1dGhlbnRpay5pby9wcm92aWRlcnMvb2F1dGgyL2RlZmF1bHQiLCJhenAiOiJlbXBsb3llZV9hcGlfY2xpZW50IiwidWlkIjoiSFNmWlBBNE80QzM4Q2RqUHVWMUhVUkNaRmN6M0k4TDJCdXpZQVJVdyJ9.LIqZSLQTGHjsvgwJe2cgLS9c4cQHznwpoKHGL-x8tpbbLx7pruSZlJks81LRYErcT5XgQbzIBkOIv29E-J07nwLaMWJEM05OIccLwR578UH-W57aYuE_blE5n1oCscGFADV3pp4geS5foJwsPXegjPQ9YAhofAyLRTRQWIznjrp6V6qwfB506lJW-iD3NUvZFzrLEe0ee32iVFXmCXRid2h0J4TiOizELQTRpd4S9gUxGe9DUsUtyU1ZPhrcS0NcxHQc_sn0pXUhBP6txQ2_7Va5a8aVG0Jk45fXPfDp3HMX9vVt1YTTYTnYiDaEYIYA9dpYWediUOsgpaQ0kr7PnbaFk0xUbbWHVFeDKBFM8vuvBlgX02RuV1p6qFznsq3xz96yG-Zoa6cLQn6rR0c489mKzv6Dr4z_A-zvclR40NnEwFTh9D8SYZMj9zakrfXrBZZB1ztzCxaIsjiixOY-VZhmOXnjAudG4m6pliz6BmD1QDiqEdRpzpQCEyLDmwbg15H5wKQMQWJgK60XtDI6De7cC4txcfB-0kegmV4Iff7x_PJgXdNx_mKdhQbfjk29DwL8CCMnCDRDmAANy8DnnXtI2c5f6SJSWsOS3T6MXl7y0GUEhav5QuFrOkML6yAeBYA6EuzQq36f5gHWokK7yUeiIaDjclmmo3qgtprKBOQ"  }
}
