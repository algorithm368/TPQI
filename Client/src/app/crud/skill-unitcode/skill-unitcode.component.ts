import { Component } from '@angular/core';
import { SkillUnitcodeService } from '../../service-crud/skill-unitcode.service';

@Component({
  selector: 'app-skill-unitcode',
  templateUrl: './skill-unitcode.component.html',
  styleUrl: './skill-unitcode.component.scss'
})
export class SkillUnitcodeComponent {

  uskills: any[] = [];
  formuskillData: any = { id_unit_code: '' ,id_skill: ''};
  editIduskill: number | null = null;

  unitcodeOptions: any[] = [];

  skillOptions: any[] = [];
  
  constructor(private uskillService: SkillUnitcodeService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getUskills();
    this.getKnowlegesOptions();
    this.getUnitcodesOptions();
  }

  getUskills() {
    this.uskillService.getUskills().subscribe(
      (data: any) => {
      this.uskills = data.data
    }
    );
  }

  getKnowlegesOptions() {
    this.uskillService.getSkills().subscribe(
      (data: any) => {
        this.skillOptions = data.data
      }
    );
  }

  getUnitcodesOptions() {
    this.uskillService.getUnitcodes().subscribe(
      (data: any) => {
        this.unitcodeOptions = data.data
      }
    );
  }

  getUniqueUnitcodeOptions(): string[] {
    return Array.from(new Set(this.uskills.map(uskill => uskill.id_unit_code)));
  }

  getUniqueSkillOptions(): string[] {
    return Array.from(new Set(this.uskills.map(uskill => uskill.id_skill)));
  }



  onSubmitForm() {
    if (this.editIduskill === null) {
      // Create a new career level
      this.uskillService.createUskill(this.formuskillData).subscribe(() => {
        this.getUskills();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.uskillService.updateUskill(this.editIduskill, this.formuskillData).subscribe(() => {
        this.getUskills();
        this.resetForm();
      });
    }
  }
  
  onEdit(uskill: any) {
    this.editIduskill = uskill.id_u_skill;
    this.formuskillData.id_unit_code = uskill.id_unit_code;
    this.formuskillData.id_skill = uskill.id_skill;
  }
  
  onDelete(id: number) {
    this.uskillService.deleteUskill(id).subscribe(() => {
      this.getUskills();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIduskill = null;
    this.formuskillData.id_unit_code = '';
    this.formuskillData.id_skill = '';
  }


}
