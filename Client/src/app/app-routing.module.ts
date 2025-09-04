import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerlevelDetailsComponent } from './careerlevel-details/careerlevel-details.component';
import { RegisterComponent } from './homepage/register/register.component';
import { LoginComponent } from './homepage/login/login.component';
import { HomeComponent } from './homepage/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { CareerComponent } from './crud/career/career.component';
import { CareerLevelComponent } from './crud/career-level/career-level.component';
import { DetailsComponent } from './crud/details/details.component';
import { AllDetailsComponent } from './crud/all-details/all-details.component';
import { UnitcodeDetailsComponent } from './unitcode-details/unitcode-details.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ReferenceComponent } from './reference/reference.component';
import { ResetPasswordComponent } from './homepage/reset-password/reset-password.component';

const routes: Routes = [


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'career/:id', component: CareerlevelDetailsComponent },
  { path: 'unitcodedetails/:id', component: UnitcodeDetailsComponent },
  { path: 'crud_career', component: CareerComponent },
  { path: 'crud_career_level', component: CareerLevelComponent },
  { path: 'crud_details', component: DetailsComponent },
  { path: 'crud_all', component: AllDetailsComponent },
  { path: 'updateProfile/:id', component: UpdateProfileComponent },
  { path: 'about-us', component: AboutUsComponent},
  { path: 'reference', component: ReferenceComponent},
  { path: 'reset-password', component: ResetPasswordComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
