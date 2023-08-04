import { Component, OnInit } from '@angular/core';
import { faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  roles: string[] = [];

  constructor (private authService: AuthService) {}


    ngOnInit(): void {
      this.authService.roles.subscribe(
        data => this.roles = data
      );
    }

  title = 'second-hand-clothes';
  faKebab = faEllipsisVertical;
}