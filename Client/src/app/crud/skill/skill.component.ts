import { Component } from '@angular/core';
import { SkillService } from '../../service-crud/skill.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss'
})
export class SkillComponent {

  skills: any[] = [];
  formskillData: any = { name_skill: '' };
  editIdskill: number | null = null;

  constructor(private skillService: SkillService) {}

  ngOnInit() {
    this.getSkill();

  }

  getSkill() {
    this.skillService.getSkills().subscribe((data: any) => {
      this.skills = data.data;
    });
  }

  onSubmitSkill() {
    if (this.editIdskill === null) {
      // Create a new career
      this.skillService.createSkill(this.formskillData).subscribe(() => {
        this.getSkill();
        this.formskillData.name_skill = '';
      });
    } else {
      // Update an existing career
      this.skillService.updateSkill(this.editIdskill, this.formskillData).subscribe(() => {
        this.getSkill();
        this.editIdskill = null;
        this.formskillData.name_skill = '';
      });
    }
  }

  editSkill(skill: any) {
    this.editIdskill = skill.id_skill;
    this.formskillData.name_skill = skill.name_skill;
  }

  deleteSkill(id: number) {
    this.skillService.deleteSkill(id).subscribe(() => {
      this.getSkill();
    });
  }

}
