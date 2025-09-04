import { Component } from '@angular/core';
import { SectorService } from '../../service-crud/sector.service';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.scss'
})
export class SectorComponent {

  sectors: any[] = [];
  formsectorData: any = { name_sector: '' };
  editIdsector: number | null = null;

  constructor(private sectorService: SectorService) {}

  ngOnInit() {
    this.getSector();

  }

  getSector() {
    this.sectorService.getSector().subscribe((data: any) => {
      this.sectors = data.data;
    });
  }

  onSubmit() {
    if (this.editIdsector === null) {
      // Create a new career
      this.sectorService.createSector(this.formsectorData).subscribe(() => {
        this.getSector();
        this.formsectorData.name_sector = '';
      });
    } else {
      // Update an existing career
      this.sectorService.updateSector(this.editIdsector, this.formsectorData).subscribe(() => {
        this.getSector();
        this.editIdsector = null;
        this.formsectorData.name_sector = '';
      });
    }
  }

  editSector(sector: any) {
    this.editIdsector = sector.id_sector;
    this.formsectorData.name_sector = sector.name_sector;
  }

  deleteSector(id: number) {
    this.sectorService.deleteSector(id).subscribe(() => {
      this.getSector();
    });
  }

}
