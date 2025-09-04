import { Component } from '@angular/core';
import { CareerlevelKnowledgeService } from '../../service-crud/careerlevel-knowledge.service';

@Component({
  selector: 'app-careerlevel-knowledge',
  templateUrl: './careerlevel-knowledge.component.html',
  styleUrl: './careerlevel-knowledge.component.scss'
})
export class CareerlevelKnowledgeComponent {

  clknowleges: any[] = [];
  formclknowlegesData: any = { id_career_level: '',id_knowlege	: '' };
  editIdclknowlege: number | null = null;

  careerlevelOptions: any[] = [];
  
  knowlegesOptions: any[] = [];

  constructor(private clknowlegeService: CareerlevelKnowledgeService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getClKnowlege();
    this.getCareerLevelOptions();
    this.getKnowlegesOptions();
  }

  getClKnowlege() {
    this.clknowlegeService.getClKnowlege().subscribe((data: any) => {
        this.clknowleges = data.data
    }
    );
  }

  getCareerLevelOptions() {
    this.clknowlegeService.getCareerLevel().subscribe((data: any) => {
      this.careerlevelOptions = data.data
    }
    );
  }

  getKnowlegesOptions() {
    this.clknowlegeService.getKnowleges().subscribe((data: any) => { 
      this.knowlegesOptions = data.data
    }
    );
  }

  getUniqueCareerLevelOptions(): string[] {
    return Array.from(new Set(this.clknowleges.map(clknowlege => clknowlege.id_career_level)));
  }

  getUniqueKnowlegeOptions(): string[] {
    return Array.from(new Set(this.clknowleges.map(clknowlege => clknowlege.id_knowlege)));
  }

  onSubmitForm() {
    if (this.editIdclknowlege === null) {
      // Create a new career level
      this.clknowlegeService.createClKnowlege(this.formclknowlegesData).subscribe(() => {
        this.getClKnowlege();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.clknowlegeService.updateClKnowlege(this.editIdclknowlege, this.formclknowlegesData).subscribe(() => {
        this.getClKnowlege();
        this.resetForm();
      });
    }
  }
  
  onEdit(clknowlege: any) {
    this.editIdclknowlege = clknowlege.id_cl_knowlege;
    this.formclknowlegesData.id_career_level = clknowlege.id_career_level;
    this.formclknowlegesData.id_knowlege = clknowlege.id_knowlege;
  }
  
  onDelete(id: number) {
    this.clknowlegeService.deleteClKnowlege(id).subscribe(() => {
      this.getClKnowlege();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdclknowlege = null;
    this.formclknowlegesData.id_career_level = '';
    this.formclknowlegesData.id_knowlege = '';
  }


}
