import { Component } from '@angular/core';
import { CareerlevelSkillService } from '../../service-crud/careerlevel-skill.service';

@Component({
  selector: 'app-careerlevel-skill',
  templateUrl: './careerlevel-skill.component.html',
  styleUrl: './careerlevel-skill.component.scss'
})
export class CareerlevelSkillComponent {

  clskills: any[] = [];
  formclskillsData: any = { id_career_level: '',id_skill	: '' };
  editIdclskills: number | null = null;

  careerlevelOptions: any[] = [];
  
  skillsOptions: any[] = [];

  constructor(private clskillsService: CareerlevelSkillService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getClSkill();
    this.getCareerLevelOptions();
    this.getSkillsOptions();
  }

  getClSkill() {
    this.clskillsService.getClSkill().subscribe((data: any) => {
        this.clskills = data.data
    }
    );
  }

  getCareerLevelOptions() {
    this.clskillsService.getCareerLevel().subscribe((data: any) => {
      this.careerlevelOptions = data.data
    }
    );
  }

  getSkillsOptions() {
    this.clskillsService.getSkills().subscribe((data: any) => { 
      this.skillsOptions = data.data
    }
    );
  }

  getUniqueCareerLevelOptions(): string[] {
    return Array.from(new Set(this.clskills.map(clskill => clskill.id_career_level)));
  }

  getUniqueSkillsOptions(): string[] {
    return Array.from(new Set(this.clskills.map(clskill => clskill.id_skill)));
  }

  onSubmitForm() {
    if (this.editIdclskills === null) {
      // Create a new career level
      this.clskillsService.createClSkill(this.formclskillsData).subscribe(() => {
        this.getClSkill();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.clskillsService.updateClSkill(this.editIdclskills, this.formclskillsData).subscribe(() => {
        this.getClSkill();
        this.resetForm();
      });
    }
  }
  
  onEdit(clskill: any) {
    this.editIdclskills = clskill.id_cl_skills;
    this.formclskillsData.id_career_level = clskill.id_career_level;
    this.formclskillsData.id_skill = clskill.id_skill;
  }
  
  onDelete(id: number) {
    this.clskillsService.deleteClSkill(id).subscribe(() => {
      this.getClSkill();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdclskills = null;
    this.formclskillsData.id_career_level = '';
    this.formclskillsData.id_skill = '';
  }


}
