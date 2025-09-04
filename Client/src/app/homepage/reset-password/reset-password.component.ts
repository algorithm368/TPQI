import { Component } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetError: string | null = null;
  resetSuccess: string | null = null;

  resetInProgress = false;
  constructor(private homeService: HomeService, private router: Router) {}

  resetPassword(form: NgForm): void {
    if (form.valid) {
      const { email, newPassword, confirmPassword } = form.value;

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        this.resetError = 'รหัสผ่านไม่ตรงกัน';
        this.resetSuccess = null;
        return;
      }

      // Reset error and success messages
      this.resetError = null;
      this.resetSuccess = null;

      // Initiate password reset
      this.resetInProgress = true; // Add a loading indicator
      this.homeService.resetPassword({ email, newPassword }).subscribe(
        (response) => {
          this.resetSuccess = response.message;
          // Navigate to the profile page upon successful password reset
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Password reset error:', error);
          this.resetError = error.error && error.error.error ? error.error.error : 'Unknown error';
        },
        () => {
          this.resetInProgress = false; // Remove loading indicator when complete
        }
      );
    }
  }
}
