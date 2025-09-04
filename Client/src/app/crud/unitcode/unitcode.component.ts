import { Component } from '@angular/core';
import { UnitcodeService } from '../../service-crud/unitcode.service';

@Component({
  selector: 'app-unitcode',
  templateUrl: './unitcode.component.html',
  styleUrl: './unitcode.component.scss'
})
export class UnitcodeComponent {

  units: any[] = [];
  formunitsData: any = {
    unit_code: '',
    name: '',
    no_3: '',
    no_4: '',
    no_5: '',
    no_6: '',
    no_7: '',
    no_8: '',
    no_9: '',
    no_10: '',
    no_12: ''
   };
  editIdunit: number | null = null;

  constructor(private unitcodeService: UnitcodeService) {}

  ngOnInit() {
    this.getUnitcode();

  }

  getUnitcode() {
    this.unitcodeService.getUnitcodes().subscribe((data: any) => {
      this.units = data.data;
    });
  }

  onSubmitUnitcode() {
    if (this.editIdunit === null) {
      // Create a new career
      this.unitcodeService.createUnitcode(this.formunitsData).subscribe(() => {
        this.getUnitcode();
        this.formunitsData.unit_code = '';
        this.formunitsData.name = '';
        this.formunitsData.no_3 = '';
        this.formunitsData.no_4 = '';
        this.formunitsData.no_5 = '';
        this.formunitsData.no_6 = '';
        this.formunitsData.no_7 = '';
        this.formunitsData.no_8 = '';
        this.formunitsData.no_9 = '';
        this.formunitsData.no_10 = '';
        this.formunitsData.no_12 = '';
      });
    } else {
      // Update an existing career
      this.unitcodeService.updateUnitcode(this.editIdunit, this.formunitsData).subscribe(() => {
        this.getUnitcode();
        this.editIdunit = null;
        this.formunitsData.unit_code = '';
        this.formunitsData.name = '';
        this.formunitsData.no_3 = '';
        this.formunitsData.no_4 = '';
        this.formunitsData.no_5 = '';
        this.formunitsData.no_6 = '';
        this.formunitsData.no_7 = '';
        this.formunitsData.no_8 = '';
        this.formunitsData.no_9 = '';
        this.formunitsData.no_10 = '';
        this.formunitsData.no_12 = '';
      });
    }
  }

  editUnitcode(unit: any) {
    this.editIdunit = unit.id_unit_code;
    this.formunitsData.unit_code = unit.unit_code;
    this.formunitsData.name = unit.name;
    this.formunitsData.no_3 = unit.no_3;
    this.formunitsData.no_4 = unit.no_4;
    this.formunitsData.no_5 = unit.no_5;
    this.formunitsData.no_6 = unit.no_6;
    this.formunitsData.no_7 = unit.no_7;
    this.formunitsData.no_8 = unit.no_8;
    this.formunitsData.no_9 = unit.no_9;
    this.formunitsData.no_10 = unit.no_10;
    this.formunitsData.no_12 = unit.no_12;
  }

  deleteUnitcode(id: number) {
    this.unitcodeService.deleteUnitcode(id).subscribe(() => {
      this.getUnitcode();
    });
  }

}
