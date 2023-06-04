import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private oauthService: OAuthService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      var hasIdToken = this.oauthService.hasValidIdToken();
      var hasAccessToken = this.oauthService.hasValidAccessToken();

      console.log(hasIdToken);

    if (hasAccessToken && hasIdToken) {
      return true;
    } else {
      this.router.navigateByUrl('/products');
      return false;
    }
  }
  
}
