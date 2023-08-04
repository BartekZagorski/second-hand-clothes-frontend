import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject } from 'rxjs';
import { authCodeFlowConfig } from '../sso-config';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles: Subject<string[]> = new BehaviorSubject<string[]>([]);
  userFullName: Subject<string> = new BehaviorSubject<string>("");

  constructor(private oauthService: OAuthService) {}

   login() {
    this.oauthService.initCodeFlow();
   } 

   logout(){
    this.oauthService.logOut();
  }

  
  configureSSO() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(
      () => {
        const userClaims: any = this.oauthService.getIdentityClaims();
        this.userFullName.next(userClaims?.name ? userClaims?.name : "");
        this.updateRoles();
      }
    );

  }

   updateRoles() {
    if(this.oauthService.hasValidAccessToken()) {
      this.roles.next(this.oauthService.getIdentityClaims()['realm_access']['roles']);
    }
   }

   public get token() {
    let claims =  this.oauthService.getIdToken();
    return claims ? claims : null;
  }
}
