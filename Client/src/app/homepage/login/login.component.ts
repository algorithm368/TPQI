import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  email = '';
  password = '';
  errorMessage = '';

  incorrectPassword: boolean = false;

  isLoggedIn: boolean = false;
  constructor(private homeService: HomeService, private router: Router)
  {

  }

  ngOnInit(): void {
    // Check the initial authentication status when the component is initialized
    this.isLoggedIn = this.homeService.isLoggedIn();
  }



  loginUser(): void {
    this.homeService.login(this.email, this.password).subscribe(
      (response) => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.errorMessage = '';
        this.isLoggedIn = true;
  
        // Check if the logged-in user is an admin based on their email
        if (this.email === 'admin63@gmail.com') {
          // Navigate to the admin page if the email is admin@gmail.com
          this.router.navigate(['/admin']);
        } else {
          // Navigate to the home page for regular users
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
        this.errorMessage = error.error.error || 'An error occurred during login.';
        this.incorrectPassword = true;
      }
    );
  }



  navigateToForgotPassword(): void {
    this.router.navigate(['/reset-password']);
  }


}
