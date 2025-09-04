import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {

  userProfile: any;
  selectedFile: File | null = null;
  userProfileImage: string | null = null;
  isEditMode: boolean = false;
  profileId!: number;

  constructor(private profileService: ProfileService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.profileId = +params['id'];
      this.getProfile();
    });
  }

  getProfile() {
    this.profileService.getProfileById(this.profileId).subscribe(
      (data: any) => {
        this.userProfile = data.data;
      },
      (error) => {
        console.error('Error getting profile:', error);
      }
    );
  }

  updateProfile() {
    if (this.userProfile) {
      this.profileService.updateProfile(this.profileId, this.userProfile).subscribe(
        (response) => {
          console.log('Profile updated successfully:', response);
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  uploadProfileImage(): void {
    if (this.selectedFile) {
      this.profileService.uploadProfileImage(this.profileId,this.selectedFile).subscribe(
        (response) => {
          console.log('Profile image uploaded successfully:', response);
          this.getProfile();
        },
        (error) => {
          console.error('Error uploading profile image:', error);
        }
      );
    }
  }

  
}
  