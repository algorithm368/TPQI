import { Component, OnInit } from '@angular/core';
import { CareerLevelService } from '../../service-crud/career-level.service';

@Component({
  selector: 'app-career-level',
  templateUrl: './career-level.component.html',
  styleUrl: './career-level.component.scss'
})
export class CareerLevelComponent implements OnInit{
  careersLevels: any[] = [];
  formCareerLevelData: any = { id_career: '', id_level: '' };
  editIdCareerLevel: number | null = null;

  careers: any[] = [];
  levels: any[] = [];

  constructor(private careerLevelsService: CareerLevelService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getCareerLevels();
    this.getCareers();
    this.getLevels();
  }

  getCareers() {
    // เรียกใช้งาน getCareer() จาก CareerlevelService
    this.careerLevelsService.getCareers().subscribe((data: any) => {
      this.careers = data.data;
    });
  }
  
  getLevels() {
    // เรียกใช้งาน getrLevel() จาก CareerlevelService
    this.careerLevelsService.getLevels().subscribe((data: any) => {
      this.levels = data.data;
    });
  }

  getCareerLevels() {
    this.careerLevelsService.getCareerLevel().subscribe((data: any) => {
      this.careersLevels = data.data;
    });
  }

  // Method to get unique career options
  getUniqueCareerOptions(): string[] {
    return Array.from(new Set(this.careersLevels.map(career => career.id_career)));
  }

  // Method to get unique level options
  getUniqueLevelOptions(): string[] {
    return Array.from(new Set(this.careersLevels.map(career => career.id_level)));
  }

  onSubmitForm() {
    if (this.editIdCareerLevel === null) {
      // Create a new career level
      this.careerLevelsService.createCareerLevel(this.formCareerLevelData).subscribe(() => {
        this.getCareerLevels();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.careerLevelsService.updateCareerLevel(this.editIdCareerLevel, this.formCareerLevelData).subscribe(() => {
        this.getCareerLevels();
        this.resetForm();
      });
    }
  }
  
  onEdit(careerslevel: any) {
    this.editIdCareerLevel = careerslevel.id_career_level;
    this.formCareerLevelData.id_career = careerslevel.id_career;
    this.formCareerLevelData.id_level = careerslevel.id_level;
  }
  
  onDelete(id: number) {
    this.careerLevelsService.deleteCareerLevel(id).subscribe(() => {
      this.getCareerLevels();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdCareerLevel = null;
    this.formCareerLevelData.id_career = '';
    this.formCareerLevelData.id_level = '';
  }

}
