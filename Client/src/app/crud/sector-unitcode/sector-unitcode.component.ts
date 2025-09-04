import { Component } from '@angular/core';
import { SectorUnitcodeService } from '../../service-crud/sector-unitcode.service';

@Component({
  selector: 'app-sector-unitcode',
  templateUrl: './sector-unitcode.component.html',
  styleUrl: './sector-unitcode.component.scss'
})
export class SectorUnitcodeComponent {

  usectors: any[] = [];
  formusectorData: any = { id_unit_code: '' ,id_sector: ''};
  editIdusector: number | null = null;

  unitcodeOptions: any[] = [];

  sectorOptions: any[] = [];
  
  constructor(private usectorService: SectorUnitcodeService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getUnitUnitSector();
    this.getSectorOptions();
    this.getUnitcodesOptions();
  }

  getUnitUnitSector() {
    this.usectorService.getUnitUnitSector().subscribe(
      (data: any) => {
        this.usectors = data.data
      }
    );
  }

  getSectorOptions() {
    this.usectorService.getSector().subscribe(
      (data: any) => {
        this.sectorOptions = data.data
      }
    );
  }

  getUnitcodesOptions() {
    this.usectorService.getUnitcodes().subscribe(
      (data: any) => {
        this.unitcodeOptions = data.data
      }
    );
  }

  getUniqueUnitcodeOptions(): string[] {
    return Array.from(new Set(this.usectors.map(usector => usector.id_unit_code)));
  }

  getUniqueSectorOptions(): string[] {
    return Array.from(new Set(this.usectors.map(usector => usector.id_sector)));
  }



  onSubmitForm() {
    if (this.editIdusector === null) {
      // Create a new career level
      this.usectorService.createUnitSector(this.formusectorData).subscribe(() => {
        this.getUnitUnitSector();
        this.resetForm();
      });
    } else {
      // Update an existing career level
      this.usectorService.updateUnitSector(this.editIdusector, this.formusectorData).subscribe(() => {
        this.getUnitUnitSector();
        this.resetForm();
      });
    }
  }
  
  onEdit(sector: any) {
    this.editIdusector = sector.id_unit_sector;
    this.formusectorData.id_unit_code = sector.id_unit_code;
    this.formusectorData.id_sector = sector.id_sector;
  }
  
  onDelete(id: number) {
    this.usectorService.deleteUnitSector(id).subscribe(() => {
      this.getUnitUnitSector();
      this.resetForm();
    });
  }
  
  private resetForm() {
    this.editIdusector = null;
    this.formusectorData.id_unit_code = '';
    this.formusectorData.id_sector = '';
  }

}
