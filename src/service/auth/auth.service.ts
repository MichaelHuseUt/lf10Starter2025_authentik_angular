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
    return this.oauthService.getAccessToken() ?? "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI0MWRiZGEzODQ1NWI3ZGM5OTQwYzY2ZTI4ZDFjZDg0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXBwbGljYXRpb24vby9lbXBsb3llZV9hcGkvIiwic3ViIjoiNmUyNWIwMzhjYjFiNWUxZGI2ZWEzZGVjNTRlN2RhNmMxNTM5NjY4ZjM3Y2Q4YTIzOWIzZWNmOTFhNmMyMjRiZCIsImF1ZCI6ImVtcGxveWVlX2FwaV9jbGllbnQiLCJleHAiOjE3Njg0NjUyMDYsImlhdCI6MTc2ODQ2MjIwNiwiYXV0aF90aW1lIjoxNzY4NDYyMjA2LCJhY3IiOiJnb2F1dGhlbnRpay5pby9wcm92aWRlcnMvb2F1dGgyL2RlZmF1bHQiLCJhenAiOiJlbXBsb3llZV9hcGlfY2xpZW50IiwidWlkIjoiUDM2OE5pMnk5TWFCRU15ZTVORHljUUpjWXZQeFZnTHFzVk1KM3gybCJ9.sjfaJ8ED49ibpFm5uguusWOhHVLJDmyiY0uNJ8cthFFgGeiAwU9OPxF-vo1Or5fg81uXbDrb-jqn6Dr9Z4hmd_ApkRBfETwicvL393Wk2DX-IZXvCmYv5gXfoT_hIULsTgZfZ5N5Uvb2nvAZQOfPPRz1UNCDOfUGw4ZBoZa3mBGQuPa4FoeXQudGXfF9PWEdqstFTje80XcSXmo8JHf4pmTP79Gd6tK7CLh9OwTNeVpHWkZVl6JinAvS2ZL1M5pyGZnmeTjCwQLbjEAX0YIbEoAdI8Xd0vHwbot92o3ZCBhQmgdJGAvYKVsW4Qu84fq35DFdQEQ_PqRDCfuv4FuJuiAsZIvxiecmLMU9KgAx1-npI-BcJ6z_nWtBk2ZVImPd2p76i5rnfzQaSkavInCCiKq5mmo3_bivfdF9txV8Rz7O4L4TwF3CJHry9XC7rMRryn9AgIF7vZR9AhXYrZmNY6a1AFkPiPuvRraOuSqAR9QyrMqPiaH2Aqejan6Jw6lFcQHHrSDqU266QEyskoaFz49xgOextP8uZk-sXCNkVOKCDXVzZ1CCzmeR6-Hv2BZO-h0rXzAXGBpqkxfELm0Xh4b6tl--bQvE9kT76XrKeoZ4-QMzArQz7VXxLioKWiFInHc4TQF_Z5X2-E5VB8pysIKW0MOrCvaVG-u5r5n-xMI";
  }
}
