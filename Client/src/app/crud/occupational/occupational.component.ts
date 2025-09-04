import { Component } from '@angular/core';
import { OccupationalService } from '../../service-crud/occupational.service';

@Component({
  selector: 'app-occupational',
  templateUrl: './occupational.component.html',
  styleUrl: './occupational.component.scss'
})
export class OccupationalComponent {

  occupationals: any[] = [];
  formoccupationalsData: any = { 	name_occupational: '' };
  editIdoccupationals: number | null = null;

  constructor(private occupationalService: OccupationalService) {}

  ngOnInit() {
    this.getOccupational();

  }

  getOccupational() {
    this.occupationalService.getOccupational().subscribe((data: any) => {
      this.occupationals = data.data;
    });
  }

  onSubmit() {
    if (this.editIdoccupationals === null) {
      // Create a new career
      this.occupationalService.createOccupational(this.formoccupationalsData).subscribe(() => {
        this.getOccupational();
        this.formoccupationalsData.name_occupational = '';
      });
    } else {
      // Update an existing career
      this.occupationalService.updateOccupational(this.editIdoccupationals, this.formoccupationalsData).subscribe(() => {
        this.getOccupational();
        this.editIdoccupationals = null;
        this.formoccupationalsData.name_occupational = '';
      });
    }
  }

  editCareer(occupational: any) {
    this.editIdoccupationals = occupational.id_occupational;
    this.formoccupationalsData.name_occupational = occupational.name_occupational;
  }

  deleteCareer(id: number) {
    this.occupationalService.deleteOccupational(id).subscribe(() => {
      this.getOccupational();
    });
  }

}
