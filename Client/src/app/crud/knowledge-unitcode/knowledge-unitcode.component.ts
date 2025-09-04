import { Component } from '@angular/core';
import { KnowledgeUnitcodeService } from '../../service-crud/knowledge-unitcode.service';

@Component({
  selector: 'app-knowledge-unitcode',
  templateUrl: './knowledge-unitcode.component.html',
  styleUrl: './knowledge-unitcode.component.scss'
})
export class KnowledgeUnitcodeComponent {

  uknowledges: any[] = [];
  formuknowlegeData: any = { id_unit_code	: '',id_knowlege: '' };
  editIduknowlege: number | null = null;

  unitcodeOptions: any[] = [];

  knowlegeOptions: any[] = [];
  
  constructor(private uknowlegeService: KnowledgeUnitcodeService) {}
  

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getUknowleges();
    this.getKnowlegesOptions();
    this.getUnitcodesOptions();
  }

  getUknowleges() {
    this.uknowlegeService.getUknowleges().subscribe(
      (data: any) => {
        this.uknowledges = data.data
      }
    );
  }

  getKnowlegesOptions() {
    this.uknowlegeService.getKnowleges().subscribe(
      (data: any) => {
        this.knowlegeOptions = data.data
      }
    );
  }

  getUnitcodesOptions() {
    this.uknowlegeService.getUnitcodes().subscribe(
      (data: any) => {
        this.unitcodeOptions = data.data
      }
    );
  }

  getUniqueUnitcodeOptions(): string[] {
    return Array.from(new Set(this.uknowledges.map(uknowledge => uknowledge.id_unit_code)));
  }

  getUniqueKnowledgeOptions(): string[] {
    return Array.from(new Set(this.uknowledges.map(uknowledge => uknowledge.id_knowlege)));
  }



  onSubmitForm() {
    if (this.editIduknowlege === null) {
      // Create a new career level
      this.uknowlegeService.createUknowlege(this.formuknowlegeData).subscribe(() => {
        this.getUknowleges();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.uknowlegeService.updateUknowlege(this.editIduknowlege, this.formuknowlegeData).subscribe(() => {
        this.getUknowleges();
        this.resetForm();
      });
    }
  }
  
  onEdit(uknowledge: any) {
    this.editIduknowlege = uknowledge.id_u_knowlege;
    this.formuknowlegeData.id_unit_code = uknowledge.id_unit_code;
    this.formuknowlegeData.id_knowlege = uknowledge.id_knowlege;
  }
  
  onDelete(id: number) {
    this.uknowlegeService.deleteUknowlege(id).subscribe(() => {
      this.getUknowleges();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIduknowlege = null;
    this.formuknowlegeData.id_unit_code = '';
    this.formuknowlegeData.id_knowlege = '';
  }

}
