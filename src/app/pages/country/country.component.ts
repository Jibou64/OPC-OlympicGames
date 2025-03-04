import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Observable, Subscription, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';




@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy, AfterViewInit {
  country!: Olympic;
  olympics$!: Observable<Array<Olympic>>;
  countryId!: number;
  lineChart: any;
  numberOfLabels: Array<number> = [];
  numberOfMedals: Array<number> = [];
  totalMedals: number = 0;
  totalAthletes: number = 0;
  subscription!: Subscription;
  mobileMedia:any = window.matchMedia("(max-width:520px")
  screenType:boolean = false;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.mobileMedia.matches){
      this.screenType = !this.screenType;
    }
    else {
      this.screenType = this.screenType;
    }
  }




  ngAfterViewInit(): void {
    this.createChart();
  }


// generate datas from our observable olympics
  ngOnInit(): any {
    this.countryId = +this.route.snapshot.params['id'];
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((value) =>
      this.modifyChartData(value)
    );
  }

//Close the data generated from our observables olympics
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
     * Creates an empty pie chart, responsive.
     * Creates the click event that lets navigate to specific chosen country
     */
  createChart(): void {
    this.lineChart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: this.numberOfLabels,
        datasets: [
          {
            data: this.numberOfMedals
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          }
        },
      },
    });
  }
  /**
   * Populates the empty pie chart with correct data
   *
   * @param olympics - The array of olympics retrieved by service
   */

  modifyChartData(olympics: Array<Olympic>): void {
    if (olympics) {
      const olympic = olympics[this.countryId].participations;
      for (let entry of olympic) {
        this.numberOfLabels.push(entry.year);
        this.numberOfMedals.push(entry.medalsCount);
        this.totalMedals += entry.medalsCount;
        this.totalAthletes += entry.athleteCount;
        console.log("Reussi")
      }
      this.createChart();
    } else {
      console.log("Raté")
      this.router.navigateByUrl('error');
    }
  }

  
  goBackHome(): void {
    this.router.navigateByUrl('');
  }
}