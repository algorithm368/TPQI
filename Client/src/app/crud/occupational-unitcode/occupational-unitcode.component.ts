import { Component } from '@angular/core';
import { OccupationalUnitcodeService } from '../../service-crud/occupational-unitcode.service';

@Component({
  selector: 'app-occupational-unitcode',
  templateUrl: './occupational-unitcode.component.html',
  styleUrl: './occupational-unitcode.component.scss'
})
export class OccupationalUnitcodeComponent {

  uoccupationals: any[] = [];
  formuoccupationalData: any = { id_unit_code: '' ,id_occupational: ''};
  editIduoccupational: number | null = null;

  unitcodeOptions: any[] = [];
  occupationalOptions: any[] = [];
  
  constructor(private uoccupationalService: OccupationalUnitcodeService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getUnitOccupational();
    this.getOccupationalOptions();
    this.getUnitcodesOptions();
  }

  getUnitOccupational() {
    this.uoccupationalService.getUnitOccupational().subscribe(
      (data: any) => {
        this.uoccupationals = data.data
      }
    );
  }

  getOccupationalOptions() {
    this.uoccupationalService.getOccupational().subscribe(
      (data: any) => { 
        this.occupationalOptions = data.data
      }
    );
  }

  getUnitcodesOptions() {
    this.uoccupationalService.getUnitcodes().subscribe(
      (data: any) => {
        this.unitcodeOptions = data.data
      }
    );
  }

  getUniqueUnitcodeOptions(): string[] {
    return Array.from(new Set(this.uoccupationals.map(uoccupational => uoccupational.id_unit_code)));
  }

  getUniqueOccupationalOptions(): string[] {
    return Array.from(new Set(this.uoccupationals.map(uoccupational => uoccupational.id_occupational)));
  }



  onSubmitForm() {
    if (this.editIduoccupational === null) {
      // Create a new career level
      this.uoccupationalService.createUnitOccupational(this.formuoccupationalData).subscribe(() => {
        this.getUnitOccupational();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.uoccupationalService.updateUnitOccupational(this.editIduoccupational, this.formuoccupationalData).subscribe(() => {
        this.getUnitOccupational();
        this.resetForm();
      });
    }
  }
  
  onEdit(occupational: any) {
    this.editIduoccupational = occupational.id_unit_occupational;
    this.formuoccupationalData.id_unit_code = occupational.id_unit_code;
    this.formuoccupationalData.id_occupational = occupational.id_occupational;
  }
  
  onDelete(id: number) {
    this.uoccupationalService.deleteUnitOccupational(id).subscribe(() => {
      this.getUnitOccupational();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIduoccupational = null;
    this.formuoccupationalData.id_unit_code = '';
    this.formuoccupationalData.id_occupational = '';
  }

}
