import { Component } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileService } from '../../service/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  userData: any = {};

  passwordsDoNotMatch = false;

  selectedFile: File | null = null;
  userProfileImage: string | null = null;
  constructor(
    private homeService: HomeService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private profileService: ProfileService,) 
    {}
    register() {
      // Assuming this.userData.password and this.userData.confirmPassword are the fields in your form
      if (this.userData.password !== this.userData.confirmPassword) {
        this.passwordsDoNotMatch = true;
        // Display an error notification for password mismatch
        // this.showNotification('Password and Confirm Password do not match.', 'error');
        return;
      }
    
      this.homeService.registerUser(this.userData).subscribe(
        (response) => {
          // Registration successful
          console.log('User registered successfully', response);
    
          // Display a success notification
          // this.showNotification('Registration successful!', 'success');
    
          // Navigate to the login page
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle registration error
          console.error('Error during registration:', error);
    
          // Display an error notification
          // this.showNotification('Error during registration. Please try again.', 'error');
        }
      );
    }
    

  // showNotification(message: string, type: string) {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000, // Adjust duration as needed
  //     panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
  //   });
  // }


  
 
}