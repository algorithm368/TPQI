import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';

import {MatGridListModule} from '@angular/material/grid-list';
import {NgFor} from '@angular/common';

import {MatTableModule} from '@angular/material/table';

import { ChartModule } from 'primeng/chart';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatInputModule } from '@angular/material/input';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CareerlevelDetailsComponent } from './careerlevel-details/careerlevel-details.component';
import { HomeComponent } from './homepage/home/home.component';
import { LoginComponent } from './homepage/login/login.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { UnitcodeDetailsComponent } from './unitcode-details/unitcode-details.component';
import { RegisterComponent } from './homepage/register/register.component';
import { AllDetailsComponent } from './crud/all-details/all-details.component';
import { CareerComponent } from './crud/career/career.component';
import { CareerLevelComponent } from './crud/career-level/career-level.component';
import { CareerlevelKnowledgeComponent } from './crud/careerlevel-knowledge/careerlevel-knowledge.component';
import { CareerlevelSkillComponent } from './crud/careerlevel-skill/careerlevel-skill.component';
import { CareerlevelUnitcodeComponent } from './crud/careerlevel-unitcode/careerlevel-unitcode.component';
import { DetailsComponent } from './crud/details/details.component';
import { KnowledgeComponent } from './crud/knowledge/knowledge.component';
import { KnowledgeUnitcodeComponent } from './crud/knowledge-unitcode/knowledge-unitcode.component';
import { OccupationalComponent } from './crud/occupational/occupational.component';
import { OccupationalUnitcodeComponent } from './crud/occupational-unitcode/occupational-unitcode.component';
import { SectorComponent } from './crud/sector/sector.component';
import { SectorUnitcodeComponent } from './crud/sector-unitcode/sector-unitcode.component';
import { SkillComponent } from './crud/skill/skill.component';
import { SkillUnitcodeComponent } from './crud/skill-unitcode/skill-unitcode.component';
import { UnitcodeComponent } from './crud/unitcode/unitcode.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ReferenceComponent } from './reference/reference.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ResetPasswordComponent } from './homepage/reset-password/reset-password.component';



@NgModule({
  declarations: 
  [
    AppComponent,

    AdminComponent,
    NavbarComponent,
    CareerlevelDetailsComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarAdminComponent,
    UnitcodeDetailsComponent,
    AllDetailsComponent,
    CareerComponent,
    CareerLevelComponent,
    CareerlevelKnowledgeComponent,
    CareerlevelSkillComponent,
    CareerlevelUnitcodeComponent,
    DetailsComponent,
    KnowledgeComponent,
    KnowledgeUnitcodeComponent,
    OccupationalComponent,
    OccupationalUnitcodeComponent,
    SectorComponent,
    SectorUnitcodeComponent,
    SkillComponent,
    SkillUnitcodeComponent,
    UnitcodeComponent,
    ProfileComponent,
    UpdateProfileComponent,
    AboutUsComponent,
    ReferenceComponent,
    ResetPasswordComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    NgFor,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatInputModule,
    ChartModule,
    ProgressBarModule
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
