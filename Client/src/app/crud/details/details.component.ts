import { Component } from '@angular/core';
import { DetailsService } from '../../service-crud/details.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  details: any[] = [];
  formdetailsData: any = { 	outcomes	: ''};
  editIddetails: number | null = null;

  constructor(private detailsService: DetailsService) {}

  ngOnInit() {
    this.getDetails();
  }  

  getDetails() {
    this.detailsService.getDetails().subscribe((data: any) => {
      this.details = data.data;
    });
  }

  onSubmitDetails() {
    if (this.editIddetails === null) {
      // Create a new career
      this.detailsService.createDetails(this.formdetailsData).subscribe(() => {
        this.getDetails();
        this.formdetailsData.outcomes = '';
      });
    } else {
      // Update an existing career
      this.detailsService.updateDetails(this.editIddetails, this.formdetailsData).subscribe(() => {
        this.getDetails();
        this.editIddetails = null;
        this.formdetailsData.outcomes = '';
      });
    }
  }

  editDetails(details: any) {
    this.editIddetails = details.id_d;
    this.formdetailsData.outcomes = details.outcomes;
  }

  deleteDetails(id: number) {
    this.detailsService.deleteDetails(id).subscribe(() => {
      this.getDetails();
    });
  }

}
