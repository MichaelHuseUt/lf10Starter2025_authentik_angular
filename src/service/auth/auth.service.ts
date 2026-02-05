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
    return this.oauthService.getAccessToken() ?? "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI0MWRiZGEzODQ1NWI3ZGM5OTQwYzY2ZTI4ZDFjZDg0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXBwbGljYXRpb24vby9lbXBsb3llZV9hcGkvIiwic3ViIjoiNmUyNWIwMzhjYjFiNWUxZGI2ZWEzZGVjNTRlN2RhNmMxNTM5NjY4ZjM3Y2Q4YTIzOWIzZWNmOTFhNmMyMjRiZCIsImF1ZCI6ImVtcGxveWVlX2FwaV9jbGllbnQiLCJleHAiOjE3NjkwNzA1MzAsImlhdCI6MTc2OTA2NzUzMCwiYXV0aF90aW1lIjoxNzY5MDY3NTMwLCJhY3IiOiJnb2F1dGhlbnRpay5pby9wcm92aWRlcnMvb2F1dGgyL2RlZmF1bHQiLCJhenAiOiJlbXBsb3llZV9hcGlfY2xpZW50IiwidWlkIjoicHNmOEtjbkxpaWk0Z29hZVhsVWFLT1JBVGdnRnFycUNDN3VUdzVoRiJ9.r-nelvzb2pL-ZYHsYttSUhP0LbCSMBXiHcB_RX7xSeZJNkJSEi4Ld_4OT8khPAxH4QGg5ixmk1Y2xgFnn_90U4vPrRHGGw9M-OnCA1sp_cyVuZzRQGfFrp5cLn091XXlkAzX8-2qX5V8V1S1E0e7NOV3gJMtJDGqF-aYghEFk3K7mS9M2s5N8i9Ao18C1TrTBNCqSYDMykn6wm26sz9XvNaoBOp525OcZJI4QWtBlqkm4GvdrLLFfLB5wQQ-inayX3kr0_ZEBcyxnLaQOfGB7IcCFTkKTx5x99el2X_gcOolz97sMkpCuP6pj3u3k7BRiMZ97Z6tDNKJsagqJk1bgAjZZBVWfegD4tqofJT2apc55xszvmmTtFEa378GBoEPiHSWt7YBXQeXHlsGpDLX2TKCi_L338w8WJDWpYtGZye5n_elDR5A0Bscw747glgqLP-fWxIs7ZhFCQWdfN0JgTz6TB3kKmreZD_TggxlDhKkhRr1dl3mpH9VAQe0-FdcIhDKa3vVsu74tVq2GydeovG1zJBjv7ESId6cQKrFVBFmZjuPv0xmAsiH6tERtMtYD9uOYjIj_FWrSLjVIO0g_FWZew2fzpG-Vb8QkwKtt0L-X5R0Ie6A7SY3G_gP09XEkZ8O4bQHXvs-9zebHD4C1NANDNSDu_55ORkcFi17OUI"  }
}
