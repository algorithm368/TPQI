import { Component } from '@angular/core';
import { HomeService } from '../service/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss']
})
export class NavbarAdminComponent {



  constructor(private homeService: HomeService, private router: Router) {}


  logout() {
    // Call the logout method from the UserService
    this.homeService.logout();

    // Optionally, you can redirect the user to a login page or any other desired page after logout.
    this.router.navigate(['/home']);

  }

  isLoggedIn(): boolean {
    return this.homeService.isLoggedIn(); // Adjust this based on your authentication logic
  }

}
