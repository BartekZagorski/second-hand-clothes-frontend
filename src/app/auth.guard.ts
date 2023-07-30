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

    const response = this.isLoggedIn() && this.isEmailCheckFulfiled(route) && this.isRoleCheckFulfiled(route);

    if (!response) this.router.navigateByUrl("/products");

    return response;

  }

  private isRoleCheckFulfiled(route: ActivatedRouteSnapshot): boolean {
    if (!(route.data['roles'] === undefined)) {
      const userRoles = this.oauthService.getIdentityClaims()['realm_access'].roles;
      const routeRoles = route.data['roles'];
      return routeRoles.some((value: any) => userRoles.includes(value));      
    }
    return true;
  }
  
  private isLoggedIn(): boolean {
    var hasIdToken = this.oauthService.hasValidIdToken();
    var hasAccessToken = this.oauthService.hasValidAccessToken();

    return hasIdToken && hasAccessToken;
  }

  private isEmailTheSameAsLoggedInUser (email: string): boolean {
    const storedEmail = JSON.parse(this.storage.getItem("id_token_claims_obj")!).email;
    return email == storedEmail ? true : false; 
  }

  private isEmailCheckFulfiled(route: ActivatedRouteSnapshot): boolean {
    if (route.paramMap.has("email")) {
      const email = route.paramMap.get("email")!;
      return this.isEmailTheSameAsLoggedInUser(email);
    }
    return true;
  }

}
