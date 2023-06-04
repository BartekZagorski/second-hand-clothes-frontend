import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { authCodeFlowConfig } from 'src/app/sso-config';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  userFullName: string = '';

  constructor(private oauthService: OAuthService) { }

  ngOnInit(): void {
    console.log("ngOnInit invoked");
    this.configureSSO();
  }

  configureSSO() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(
      () => {
        const userClaims: any = this.oauthService.getIdentityClaims();
        this.userFullName = userClaims?.name ? userClaims?.name : "";
      }
    );

  }

  login(){
    console.log("trying to invoke this function");
    this.oauthService.initCodeFlow();
  }

  logout(){
    this.oauthService.logOut();
  }

  public get token() {
    let claims =  this.oauthService.getIdToken();
    return claims ? claims : null;
  }
}
