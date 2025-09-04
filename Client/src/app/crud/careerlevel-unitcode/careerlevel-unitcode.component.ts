import { Component, OnInit } from '@angular/core';
import { CareerlevelUnitcodeService } from '../../service-crud/careerlevel-unitcode.service';

@Component({
  selector: 'app-careerlevel-unitcode',
  templateUrl: './careerlevel-unitcode.component.html',
  styleUrl: './careerlevel-unitcode.component.scss'
})
export class CareerlevelUnitcodeComponent implements OnInit{
  clucs: any[] = [];
  formclucData: any = { id_career_level: '',id_unit_code	: '' };
  editIdcluc: number | null = null;

  careerlevelOptions: any[] = [];
  
  unitcodeOptions: any[] = [];

  constructor(private clandunService: CareerlevelUnitcodeService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getClAndUns();
    this.getCareerLevelOptions();
    this.getUnitcodesOptions();
  }

  getClAndUns() {
    this.clandunService.getClAndUns().subscribe((data: any) => {
        this.clucs = data.data
    }
    );
  }

  getCareerLevelOptions() {
    this.clandunService.getCareerLevel().subscribe((data: any) => {
      this.careerlevelOptions = data.data
    }
    );
  }

  getUnitcodesOptions() {
    this.clandunService.getUnitcodes().subscribe((data: any) => { 
      this.unitcodeOptions = data.data
    }
    );
  }

  getUniqueCareerlevelOptions(): string[] {
    return Array.from(new Set(this.clucs.map(cluc => cluc.id_career_level)));
  }

  getUniqueUnitcodeOptions(): string[] {
    return Array.from(new Set(this.clucs.map(cluc => cluc.id_unit_code)));
  }

  onSubmitForm() {
    if (this.editIdcluc === null) {
      // Create a new career level
      this.clandunService.createClAndUn(this.formclucData).subscribe(() => {
        this.getClAndUns();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.clandunService.updateClAndUn(this.editIdcluc, this.formclucData).subscribe(() => {
        this.getClAndUns();
        this.resetForm();
      });
    }
  }
  
  onEdit(cluc: any) {
    this.editIdcluc = cluc.id_cl_uc;
    this.formclucData.id_career_level = cluc.id_career_level;
    this.formclucData.id_unit_code = cluc.id_unit_code;
  }
  
  onDelete(id: number) {
    this.clandunService.deleteClAndUn(id).subscribe(() => {
      this.getClAndUns();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdcluc = null;
    this.formclucData.id_career_level = '';
    this.formclucData.id_unit_code = '';
  }

}
