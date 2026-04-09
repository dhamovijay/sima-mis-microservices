import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FeederService, VesselMonthlyBean } from '../feeder.service';

@Component({
  selector: 'app-vessel-monthly-report',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './vessel-monthly-report.html',
  styleUrl: './vessel-monthly-report.css',
})
export class VesselMonthlyReport implements OnInit {
  loading = false;
  costLoading = false;
  vesselList: VesselMonthlyBean[] = [];

  selectedVessel: VesselMonthlyBean | null = null;
  costTables: { title: string; data: VesselMonthlyBean[] }[] = [];

  constructor(private feederService: FeederService) {}

  ngOnInit() {
    this.loadVessels();
  }

  loadVessels() {
    this.loading = true;
    this.feederService.getVesselDetails().subscribe({
      next: (res) => {
        this.loading = false;
        this.vesselList = res.vesselList || [];
      },
      error: () => (this.loading = false),
    });
  }

  selectVessel(vessel: VesselMonthlyBean) {
    this.selectedVessel = vessel;
    this.costLoading = true;
    this.costTables = [];

    this.feederService.getVesselCosts(vessel.vesselCode || '').subscribe({
      next: (res) => {
        this.costLoading = false;
        const tableNames = [
          'Operating Costs', 'Crew Costs', 'Insurance', 'Dry Dock / Repairs',
          'Management & Admin', 'Other Costs',
        ];
        const tableKeys: (keyof typeof res)[] = [
          'costTable1', 'costTable2', 'costTable3', 'costTable4', 'costTable5', 'costTable6',
        ];
        this.costTables = tableKeys
          .map((key, i) => ({
            title: tableNames[i],
            data: (res[key] as VesselMonthlyBean[] | undefined) || [],
          }))
          .filter(t => t.data.length > 0);
      },
      error: () => (this.costLoading = false),
    });
  }

  goBack() {
    this.selectedVessel = null;
    this.costTables = [];
  }

  getTableTotal(data: VesselMonthlyBean[]): number {
    return data.reduce((sum, row) => sum + (row.amount || row.totalAmount || 0), 0);
  }
}
