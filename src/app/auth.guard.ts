import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  storage: Storage = sessionStorage;

  constructor(private oauthService: OAuthService,
              private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      var hasIdToken = this.oauthService.hasValidIdToken();
      var hasAccessToken = this.oauthService.hasValidAccessToken();

      console.log(hasIdToken);

    if (hasAccessToken && hasIdToken) {
      if(!route.paramMap.has("email")) {
        return true;
      } else {
        const email = route.paramMap.get("email");
        const storedEmail = JSON.parse(this.storage.getItem("id_token_claims_obj")!).email;
        if (email == storedEmail) {
          return true;
        } else {
        this.router.navigateByUrl('/products');
        return false;
        }
      }
      
    } else {
      this.router.navigateByUrl('/products');
      return false;
    }
  }
  
}
