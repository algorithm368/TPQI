import { Component } from '@angular/core';
import { KnowledgeService } from '../../service-crud/knowledge.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.scss'
})
export class KnowledgeComponent {

  knowleges: any[] = [];
  formknowlegeData: any = { name_knowlege: '' };
  editIdknowlege: number | null = null;

  constructor(private knowlegeService: KnowledgeService) {}

  ngOnInit() {
    this.getKnowlege();

  }

  getKnowlege() {
    this.knowlegeService.getKnowleges().subscribe((data: any) => {
      this.knowleges = data.data;
    });
  }

  onSubmitKnowlege() {
    if (this.editIdknowlege === null) {
      // Create a new career
      this.knowlegeService.createKnowlege(this.formknowlegeData).subscribe(() => {
        this.getKnowlege();
        this.formknowlegeData.name_knowlege = '';
      });
    } else {
      // Update an existing career
      this.knowlegeService.updateKnowlege(this.editIdknowlege, this.formknowlegeData).subscribe(() => {
        this.getKnowlege();
        this.editIdknowlege = null;
        this.formknowlegeData.name_knowlege = '';
      });
    }
  }

  editKnowlege(knowlege: any) {
    this.editIdknowlege = knowlege.id_knowlege;
    this.formknowlegeData.name_knowlege = knowlege.name_knowlege;
  }

  deleteKnowlege(id: number) {
    this.knowlegeService.deleteKnowlege(id).subscribe(() => {
      this.getKnowlege();
    });
  }


}
