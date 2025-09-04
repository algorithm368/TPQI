import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerService } from '../service/career.service';
import { forkJoin } from 'rxjs';
import { ProfileService } from '../service/profile.service';

@Component({
  selector: 'app-careerlevel-details',
  templateUrl: './careerlevel-details.component.html',
  styleUrl: './careerlevel-details.component.scss'
})
export class CareerlevelDetailsComponent implements OnInit{

  careerLevel: any; // Define a property to store career level details
  careerLevelId!: number;

  certification: any;
  certificationId!: number;

  targetgroup: any;
  targetgroupId!: number;

  unitCodeDetails: any[] = [];
  totalCounts: any = {};

  chartUnitcodes: any[] = [];
  chartunitcodeId!: number;

  constructor (
    private careerService: CareerService,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.chartunitcodeId = +params['id']; // Get the career level ID from the route
      this.fetchData(this.chartunitcodeId);
    });

    this.route.params.subscribe((params) => {
      this.careerLevelId = +params['id']; // Get the career level ID from the route
      this.getCareerLevelDetails(this.careerLevelId);
    });

  }

  fetchData(id: number) {
    forkJoin([
      this.profileService.chartUnitcode(id),
      this.profileService.COUNTunitcode(),
    ]).subscribe(
      ([chartUnitcodes, totalCounts]) => {
        this.chartUnitcodes = chartUnitcodes;

        // Assuming totalCounts is an object with unit code as keys and totalCount as values
        const totalCountsObject = totalCounts.unitCodes;

        // Calculate the percentage for each unit code
        this.chartUnitcodes.forEach((unit) => {
          const totalCount = totalCountsObject[unit.id_unit_code]?.totalCount || 1;
          unit['percentage'] = (unit.total_count / totalCount) * 100;
        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }



  getCareerLevelDetails(id: number) {
    this.careerService.getCareerLevelById(id).subscribe(
      (data) => {
        this.careerLevel = data.data; // Assign the fetched data to the property
      },
      (error) => {
        console.error('Error fetching career level details:', error);
      }
    );
  }


  showCareerDetail(id: number) {
    if (id !== undefined) {
      // Use the Router service to navigate to the URL based on id_unit_code
      this.router.navigate(['/unitcodedetails', id]);
    } else {
      console.error('ID is undefined, unable to navigate.');
    }
  }




}
