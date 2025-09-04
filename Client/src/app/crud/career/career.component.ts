import { Component, OnInit } from '@angular/core';
import { CareerService } from '../../service-crud/career.service';


@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent implements OnInit{

  careers: any[] = [];
  formcareerData: any = { name_career: '' };
  editIdcareer: number | null = null;

  constructor(private careerService: CareerService) {}

  ngOnInit() {
    this.getCareers();

  }

  getCareers() {
    this.careerService.getCareers().subscribe((data: any) => {
      this.careers = data.data;
    });
  }

  onSubmitCareers() {
    if (this.editIdcareer === null) {
      // Create a new career
      this.careerService.createCareer(this.formcareerData).subscribe(() => {
        this.getCareers();
        this.formcareerData.name_career = '';
      });
    } else {
      // Update an existing career
      this.careerService.updateCareer(this.editIdcareer, this.formcareerData).subscribe(() => {
        this.getCareers();
        this.editIdcareer = null;
        this.formcareerData.name_career = '';
      });
    }
  }

  editCareer(career: any) {
    this.editIdcareer = career.id_career;
    this.formcareerData.name_career = career.name_career;
  }

  deleteCareer(id: number) {
    this.careerService.deleteCareer(id).subscribe(() => {
      this.getCareers();
    });
  }


}
