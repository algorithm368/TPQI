import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { catchError, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'chartjs-plugin-datalabels';  // Import the datalabels plugin



interface UserSkills {
  careerLevels: {
    [key: string]: {
      skillCount: number;
      career: string;
      level: string;
    };
  };
}

interface TotalSkills {
  careerLevels: {
    [key: string]: {
      skillCount: number;
    };
  };
}

interface UserKnowledge {
  careerLevels: {
    [key: string]: {
      knowledgeCount: number;
      career: string;
      level: string;
    };
  };
}

interface TotalKnowledge {
  careerLevels: {
    [key: string]: {
      knowledgeCount: number;
    };
  };
}

interface UserProfile {
  id: number;
  email: string;
  profileimage: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  phone: string;
  line: string;
  address: string;
}



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  @ViewChild('profileContent', { static: false }) profileContent!: ElementRef;

  careerLevelSkillsCharts: any[] = [];
  userSkills: UserSkills | null = null;

  careerLevelKnowledgeCharts: any[] = [];
  userKnowledge: UserKnowledge | null = null;

  combinedCharts: any[] = [];

  isPrinting = false;

  userProfile: UserProfile | null = null;


  constructor(
    private profileService: ProfileService,
    private renderer: Renderer2,
    private router: Router,
    ) {}


  ngOnInit() {
    this.loadData();
    this.getProfile();

  }

  getProfile() {
    this.profileService.getProfile().subscribe((data: any) => {
      this.userProfile  = data.data;
    });
  }


  navigateToForgotPassword(): void {
    this.router.navigate(['/reset-password']);
  }
  
  navigateToUpdatePage(id : number) {
    // Assuming you have a route named 'update' for the update page
    this.router.navigate(['/updateProfile' , id]);
  }


  loadData() {
    forkJoin({
      userSkills: this.profileService.getProfileSkill().pipe(catchError(error => of(null))),
      totalSkills: this.profileService.getTotalSkillsCount().pipe(catchError(error => of(null))),
      userKnowledge: this.profileService.getProfileKnowledge().pipe(catchError(error => of(null))),
      totalKnowledge: this.profileService.getTotalKnowledgeCount().pipe(catchError(error => of(null)))
    }).subscribe(({ userSkills, totalSkills, userKnowledge, totalKnowledge }) => {
      if (userSkills && totalSkills) {
        this.createChartsSkills(userSkills, totalSkills);
      }
      if (userKnowledge && totalKnowledge) {
        this.createChartsKnowledge(userKnowledge, totalKnowledge);
      }
      this.combineCharts();
    });
  }
  

  createChartsSkills(userSkills: UserSkills, totalSkills: TotalSkills) {
    this.careerLevelSkillsCharts = [];

    for (const careerLevelId in userSkills.careerLevels) {
        if (userSkills.careerLevels.hasOwnProperty(careerLevelId)) {
            const userSkillCount = userSkills.careerLevels[careerLevelId].skillCount;
            const totalSkillCount = totalSkills.careerLevels[careerLevelId]?.skillCount || 0;
            const percentage = totalSkillCount > 0 ? Math.round((userSkillCount / totalSkillCount) * 100) : 0;

            this.careerLevelSkillsCharts.push({
                careerLevelId,
                career: userSkills.careerLevels[careerLevelId].career,
                level: userSkills.careerLevels[careerLevelId].level,
                chartData: {
                    labels: [`${percentage}% User Skills`, `${100 - percentage}% Total Skills`],
                    datasets: [
                        {
                            data: [percentage, 100 - percentage],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                        }
                    ]
                }
            });
        }
    }
  }


  createChartsKnowledge(userKnowledge: UserKnowledge, totalKnowledge: TotalKnowledge) {
    this.careerLevelKnowledgeCharts = [];
  
    for (const careerLevelId in userKnowledge.careerLevels) {
      if (userKnowledge.careerLevels.hasOwnProperty(careerLevelId)) {
        const userKnowledgeCount = userKnowledge.careerLevels[careerLevelId].knowledgeCount;
        const totalKnowledgeCount = totalKnowledge.careerLevels[careerLevelId]?.knowledgeCount || 0;
        const percentage = totalKnowledgeCount > 0 ? Math.round((userKnowledgeCount / totalKnowledgeCount) * 100) : 0;
  
        this.careerLevelKnowledgeCharts.push({
          careerLevelId,
          career: userKnowledge.careerLevels[careerLevelId].career,
          level: userKnowledge.careerLevels[careerLevelId].level,
          chartData: {
            labels: [`${percentage}% User Knowledge`, `${100 - percentage}% Total Knowledge`],
            datasets: [
              {
                data: [percentage, 100 - percentage],
                backgroundColor: ["#4BC0C0", "#FFCE56"],
                hoverBackgroundColor: ["#4BC0C0", "#FFCE56"]
              }
            ]
          }
        });
      }
    }
  }
  
  
  combineCharts() {
    // Define an interface for the combined chart structure
    interface CombinedChart {
      [key: string]: {
        careerLevelId: string;
        career: string;
        level: string;
        skillsChartData?: any; // Use appropriate type instead of any
        knowledgeChartData?: any; // Use appropriate type instead of any
      };
    }
  
    const combined: CombinedChart = {};
  
    this.careerLevelSkillsCharts.forEach(chart => {
      const id = chart.careerLevelId.toString(); // Ensuring it's a string
      combined[id] = { ...chart, skillsChartData: chart.chartData };
    });
  
    this.careerLevelKnowledgeCharts.forEach(chart => {
      const id = chart.careerLevelId.toString(); // Ensuring it's a string
      if (combined[id]) {
        combined[id].knowledgeChartData = chart.chartData;
      } else {
        combined[id] = { ...chart, knowledgeChartData: chart.chartData };
      }
    });
  
    this.combinedCharts = Object.values(combined);
  }



  downloadPDF() {
    const elementToCapture = this.profileContent.nativeElement;
  
    html2canvas(elementToCapture, { useCORS: true }).then((canvas) => {
      const pdf = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        unit: 'mm',
        format: 'a4', // A4 size
        compress: false,
      });
  
      const contentDataURL = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Adjusted for borders
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(contentDataURL, 'PNG', 10, 10, imgWidth, imgHeight);
  
      pdf.save('your-ui.pdf');
    });
  }
  

  showCareerDetail(id: number) {
    this.router.navigate(['/career', id]);
  }

}
