import { Component, OnInit } from '@angular/core';
import { AllDetailsService } from '../../service-crud/all-details.service';

@Component({
  selector: 'app-all-details',
  templateUrl: './all-details.component.html',
  styleUrl: './all-details.component.scss'
})
export class AllDetailsComponent implements OnInit{

  alldetails: any[] = [];
  formallDetailsData: any = { id_career_level: '', id_d: '' };
  editIdAllDetails: number | null = null;

  careerlevelOptions: any[] = [];
  detailsOptions: any[] = [];

  constructor(private allDetailsService: AllDetailsService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getAllDetails();
    this.getCareerLevelOptions();
    this.getDetailsOptions();
  }

  getAllDetails() {
    this.allDetailsService.getAlldetails().subscribe((data: any) => {
      this.alldetails = data.data
    });
  }

  getCareerLevelOptions() {
    this.allDetailsService.getCareerLevel().subscribe((data: any) => {
      this.careerlevelOptions = data.data
    });
  }

  getDetailsOptions() {
    this.allDetailsService.getDetails().subscribe((data: any) => {
      this.detailsOptions = data.data
    });
  }

    // Method to get unique career options
    getUniqueCareerLevelOptions(): string[] {
      return Array.from(new Set(this.alldetails.map(alldetail => alldetail.id_career_level)));
    }
  
    // Method to get unique level options
    getUniqueDetailsOptions(): string[] {
      return Array.from(new Set(this.alldetails.map(alldetail => alldetail.id_d)));
    }


  onSubmitForm() {
    if (this.editIdAllDetails === null) {
      // Create a new career level
      this.allDetailsService.createAlldetails(this.formallDetailsData).subscribe(() => {
        this.getAllDetails();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.allDetailsService.updateAlldetails(this.editIdAllDetails, this.formallDetailsData).subscribe(() => {
        this.getAllDetails();
        this.resetForm();
      });
    }
  }

  onEdit(alldetail: any) {
    this.editIdAllDetails = alldetail.id_all_details;
    this.formallDetailsData.id_career_level = alldetail.id_career_level;
    this.formallDetailsData.id_d = alldetail.id_d;
  }
  
  onDelete(id: number) {
    this.allDetailsService.deleteAllDetails(id).subscribe(() => {
      this.getAllDetails();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdAllDetails = null;
    this.formallDetailsData.id_career_level = '';
    this.formallDetailsData.id_d = '';
  }


}
