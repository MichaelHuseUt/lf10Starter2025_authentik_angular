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
    return this.oauthService.getAccessToken() ?? "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMyMjBkZDAyNzBkYTZjZjI2NTdjZTA1MzVjNzQ0MmM0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXBwbGljYXRpb24vby9lbXBsb3llZV9hcGkvIiwic3ViIjoiYzQxNzk5ODY2Yzc0YzMzZDc5M2RhN2JmZjRjYzU4NzI4NzE4ZWY4ZDYwYjg3NWMzYTgwN2ViY2M1NzEzOGZhYiIsImF1ZCI6ImVtcGxveWVlX2FwaV9jbGllbnQiLCJleHAiOjE3NjkwNzI1MzksImlhdCI6MTc2OTA2OTUzOSwiYXV0aF90aW1lIjoxNzY5MDY5NTM5LCJhY3IiOiJnb2F1dGhlbnRpay5pby9wcm92aWRlcnMvb2F1dGgyL2RlZmF1bHQiLCJhenAiOiJlbXBsb3llZV9hcGlfY2xpZW50IiwidWlkIjoieTJFSXA4MUFWUkRyTXI1MDhaODdvUThRT25UdTZra3hJQ0Ewa29LRyJ9.kW7EdJk6g0-FAwejepQ6Of2qKRoodJay_eDRcoxndfwk5UhDXfpa1ElhFwNogBH8xVohR0WppbpA5b5Jtfm5rcmIUKIGXFc19fPpGTmlWDm6BpESI0oG4NCVkfj4oaySKcAkdBy8NoygvMvGRTIWblO_1rdGB9TkY5GyTtC2eiWcVIEuYKs4FIA8h9u3VrGoJ7DBKK2EFcyTYz_YGGthJaN_T3yvG_Y1tIXEMMoNgwXa9PPwkX4fqnc2Exk5nU3elRyi8rgRA2ikRQTDAnZXphSZGKqs3QiTzMYOy64NgxZ7bsC3LbGtcvWDlHy7Elk4IARmzqezN_ExcCOe3_86Jsn7iMXNvYlDW3lZpvKb3KPfPMWEBO7UF0kmMtB7Z5QEKbU4oj5h0HGcquGehgZLw6vRWz7eRHXecNd3t8aQn9lEOCWg-24vghu6ftWdzcYj7HMmjpzMJTlincX6qDUR7adliP3btlvi-3_EM9k9PFMhJPm2hiX5LTNuQIvoNPGLrNfqAbVdFpUxdL7Vl2I3XJ-YwN1BGdwGvitqHgWiFoYUthhx7KHiDh4JMBtiBtQ8L2TymOIAd7riOE3hdH6Xq79y-B2hunUNpDMBVRYx15PpJp4MXn7UoWS8S6D0BR_1ruAdv77kQiZlgrm6SxotIo2-C-bnftD8Bd2ZnlbpcLw";
  }
}
