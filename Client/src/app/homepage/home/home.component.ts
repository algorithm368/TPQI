
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CareerService } from '../../service/career.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  careerLevels: any[] = [];

  nameCareer: string = '';
  nameLevel: string = '';

  careerOptions: string[] = []; // Add options for name_career
  levelOptions: string[] = [];  // Add options for name_level

  constructor(private careerService: CareerService, private router: Router) {
    this.levelOptions = ['','ระดับ 1', 'ระดับ 2', 'ระดับ 3','ระดับ 4', 'ระดับ 5', 'ระดับ 6','ระดับ 7', 'ระดับ 8'];
  }

  ngOnInit() {
    this.careerService.getCareerLevels().subscribe((data) => {
      this.careerLevels = data.data;
    });
  }

  showCareerDetail(id: number) {
    this.router.navigate(['/career', id]);
  }

  search(): void {
    this.careerService
      .getCareerLevels(this.nameCareer, this.nameLevel)
      .subscribe((response) => {
        this.careerLevels = response.data;
      });
  }


}