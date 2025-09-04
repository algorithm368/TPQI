import { Component, OnInit, ViewChild } from '@angular/core';
import { CareerService } from '../service/career.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../service/profile.service';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { ChangeDetectorRef } from '@angular/core';


interface EocItem {
  name_eoc: string;
  pc_criteria: string;
  pc_standard: string;
  pc_system: string;
}




@Component({
  selector: 'app-unitcode-details',
  templateUrl: './unitcode-details.component.html',
  styleUrl: './unitcode-details.component.scss'
})
export class UnitcodeDetailsComponent implements OnInit{


  unitcode: any; // Define a property to store career level details
  unitcodeId!: number;

  // Additional properties for handling the form
  selectedSkillIndex: number | null = null;
  selectedSkill: any; // You may want to create a model for better type-checking

  selectedKnowledgeIndex: number | null = null;
  selectedKnowledge: any; // You may want to create a model for better type-checking


 

  profileSkillData: { link_skill: string } = { link_skill: '' };
  showSkillForm: boolean[] = [];



  profileKnowledgeData : { link_knowlege: string} = {link_knowlege : ''};
  showKnowledgeForm: boolean[] = [];


  // eocData: any;
  eocData: { name_eoc: EocItem[] } = { name_eoc: [] };
  groupedData: EocItem[] = [];

  eocID!: number;

  occupationalData: any;
  occupationalID!: number;

  sectorData: any;
  sectorID!: number;

  no9Data: any;
  no9ID!: number;



  getusersSkillsData: any;
  getusersSkillsID!: number;
  editedSkillIndex: number | null = null;

  getusersKnowledgeData: any;
  getusersKnowledgeID!: number;
  editedKnowledgeIndex: number | null = null;


  editMode: boolean = false;

  


  showUpdateForm: boolean[] = [];
  
  editedLink: string = '';

  constructor(
    private careerService: CareerService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
    
  ) 
  {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.unitcodeId = +params['id']; // Get the career level ID from the route
      this.getUnitCode(this.unitcodeId);
    });

    this.route.params.subscribe((params) => {
      this.getusersSkillsID = +params['id']; // Get the career level ID from the route
      this.getUsersSkills(this.getusersSkillsID);
    });

    this.route.params.subscribe((params) => {
      this.getusersKnowledgeID = +params['id']; // Get the career level ID from the route
      this.getUsersKnowledge(this.getusersKnowledgeID);
    });


    this.route.params.subscribe((params) => {
      this.occupationalID = +params['id']; // Get the career level ID from the route
      this.getOccupationalById(this.occupationalID);
    });

    this.route.params.subscribe((params) => {
      this.sectorID = params['id'];
      this.getSectorById(this.sectorID);
    });




  }



  getOccupationalById(id: number) {
    this.careerService.getOccupationalById(id).subscribe(
      (data) => {
        this.occupationalData = data.data;
      },
      (error) => {
        console.error('Error fetching EOC data:', error);
      }
    );
  }

  getSectorById(id: number) {
    this.careerService.getSectorById(id).subscribe(
      (data) => {
        this.sectorData = data.data;
      },
      (error) => {
        console.error('Error fetching EOC data:', error);
      }
    );
  }


  


  getUnitCode(id: number) {
    this.careerService.getUnitCode(id).subscribe(
      (data) => {
        this.unitcode = data.data; // Assign the fetched data to the property
      },
      (error) => {
        console.error('Error fetching career level details:', error);
      }
    );
  }




  getUsersSkills(id: number) {
    this.profileService.getUsersSkills(id).subscribe(
      (data) => {
        this.getusersSkillsData = data.data; // Assign the fetched data to the property
      },
      (error) => {
        console.error('Error fetching career level details:', error);
      }
    );
  }


  toggleSkillForm(index: number) {
    this.showSkillForm[index] = !this.showSkillForm[index];

  }


  editSkill(index: number, userSkill: any) {

    // Set editMode to true and populate editedLink with the existing link_skill
    this.editMode = true;
    this.editedLink = userSkill.link_skill;
    // Show the skill form
    this.showSkillForm[index] = true;

    this.toggleSkillForm(index);

  }


  deleteSkill(id: number) {
    // Assuming you have a confirmation prompt before deleting
    const confirmDelete = confirm('Are you sure you want to delete this skill?');

    if (confirmDelete) {
      this.profileService.deleteUsersSkills(id).subscribe(
        (response) => {
          console.log('Skill deleted successfully', response);
          // Implement any additional logic or reload data as needed
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting skill', error);
        }
      );
    }
  }

  
  submitForm(skillForm: any, skill: any) {
    if (skillForm.valid) {
      const id_skill = skill.id_skill;
      const updatedLinkSkill = skillForm.value.link_skill;
      const isValidUrl = this.validateUrl(updatedLinkSkill);

      if (isValidUrl) {
        if (this.editMode) {
          // Update existing skill
          this.profileService.updateUsersSkills(id_skill, {
            link_skill: updatedLinkSkill
          }).subscribe(
            (response) => {
              console.log('Skill updated successfully', response);
              alert('Skill updated successfully.');
              const newWindow = window.open(updatedLinkSkill, '_blank');

              // Check if the window opened successfully
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn('Unable to open the link. Removing the link.');
                // Remove the updated skill if the window couldn't be opened
              }
              window.location.reload();
            },
            (error) => {
              console.error('Error updating skill', error);
            }
          );

          console.log('After Update (Angular Component):', skillForm.value.link_skill);
        } else {
          // Insert new skill
          this.profileService.insertUsersSkills({
            id_skill: id_skill,
            link_skill: updatedLinkSkill
          }).subscribe(
            (response) => {
              console.log('Skill inserted successfully', response);
              alert('Skill inserted successfully.');
              const newWindow = window.open(updatedLinkSkill, '_blank');

              // Check if the window opened successfully
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn('Unable to open the link. Removing the link.');
              }
              window.location.reload();
            },
            (error) => {
              console.error('Error inserting skill', error);
            }
          );
        }

        // Reset form and variables
        skillForm.resetForm();
        this.editMode = false;
        this.editedLink = '';
        this.profileSkillData.link_skill = '';

        // Run change detection
        this.cdr.detectChanges();
      } else {
        console.error('Form is invalid');
      }
    }
  }

///////////////////////////////////////////////////////////////////////////////////////










  getUsersKnowledge(id: number) {
    this.profileService.getUsersKnowledge(id).subscribe(
      (data) => {
        this.getusersKnowledgeData = data.data; // Assign the fetched data to the property
      },
      (error) => {
        console.error('Error fetching career level details:', error);
      }
    );
  }


  toggleKnowledgeForm(index: number) {
    this.showKnowledgeForm[index] = !this.showKnowledgeForm[index];

  }


  editKnowledge(index: number, userKnowledge: any) {

    // Set editMode to true and populate editedLink with the existing link_skill
    this.editMode = true;
    this.editedLink = userKnowledge.link_knowlege;
    // Show the skill form
    this.showKnowledgeForm[index] = true;

    this.toggleKnowledgeForm(index);

  }


  deleteKnowledge(id: number) {
    // Assuming you have a confirmation prompt before deleting
    const confirmDelete = confirm('Are you sure you want to delete this Knowledge?');

    if (confirmDelete) {
      this.profileService.deleteUsersKnowledge(id).subscribe(
        (response) => {
          console.log('Knowledge deleted successfully', response);
          // Implement any additional logic or reload data as needed
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting Knowledge', error);
        }
      );
    }
  }

  submitFormKnowledge(knowledgeForm: any, knowledge : any) {
    if (knowledgeForm.valid) {
      const id_knowlege  = knowledge.id_knowlege ;
      const updatedLinkKnowledge = knowledgeForm.value.link_knowlege;
      const isValidUrl = this.validateUrl(updatedLinkKnowledge);

      if (isValidUrl) {
        if (this.editMode) {
          // Update existing skill
          this.profileService.updateUsersKnowledge(id_knowlege, {
            link_knowlege: updatedLinkKnowledge
          }).subscribe(
            (response) => {
              console.log('Knowledge updated successfully', response);
              alert('Knowledge updated successfully.');
              const newWindow = window.open(updatedLinkKnowledge, '_blank');

              // Check if the window opened successfully
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn('Unable to open the link. Removing the link.');
                // Remove the updated skill if the window couldn't be opened
              }
              window.location.reload();
            },
            (error) => {
              console.error('Error updating Knowledge', error);
            }
          );

          console.log('After Update (Angular Component):', knowledgeForm.value.link_knowlege);
        } else {
          // Insert new skill
          this.profileService.insertUsersKnowledge({
            id_knowlege: id_knowlege,
            link_knowlege: updatedLinkKnowledge
          }).subscribe(
            (response) => {
              console.log('Knowledge inserted successfully', response);
              alert('Knowledge inserted successfully.');
              const newWindow = window.open(updatedLinkKnowledge, '_blank');

              // Check if the window opened successfully
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn('Unable to open the link. Removing the link.');
              }
              window.location.reload();
            },
            (error) => {
              console.error('Error inserting skill', error);
            }
          );
        }

        // Reset form and variables
        knowledgeForm.resetForm();
        this.editMode = false;
        this.editedLink = '';
        this.profileKnowledgeData.link_knowlege = '';

        // Run change detection
        this.cdr.detectChanges();
      } else {
        console.error('Form is invalid');
      }
    }
  }


  validateUrl(url: string): boolean {
    // Check if the URL is empty or undefined
    if (!url || url.trim() === '') {
      console.warn('URL is empty or undefined');
      return false;
    }

    // Use a regular expression to check for a valid URL format
    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    const isValidUrl = urlRegex.test(url);

    if (!isValidUrl) {
      console.warn('Invalid URL format');
    }

    return isValidUrl;
  }






}
