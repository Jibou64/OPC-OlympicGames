import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CountryComponent } from '../country/country.component';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<any> = of(null);
  pieChart!: any;
  numberOfLabels: Array<string> = [];
  numberOfMedals: Array<number> = [];
  numberOfGames: number = 0;
  subscription!: Subscription;
  mobileMedia:any = window.matchMedia("(max-width:520px")
  screenType:boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) {
    if (this.mobileMedia.matches){
      this.screenType = !this.screenType;
    }
    else {
      this.screenType = this.screenType;
    }
  }

  



  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((value) => {
      this.modifyChartData(value);
      console.log(this.screenType)
    });
  }

  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

    /**
   * Populates the empty pie chart with correct data
   *
   * @param olympics - The array of olympics retrieved by service
   */

    modifyChartData(olympics: Array<Olympic>): void {
      if (olympics) {
        for (let olympic of olympics) {
          this.numberOfLabels.push(olympic.country);
          this.numberOfMedals.push(this.olympicService.countMedals(olympic));
          
        }
        this.numberOfGames = this.olympicService.countGames(olympics);
        this.createChart();
      }
    }
    /**
     * Creates an empty pie chart, responsive.
     * Creates the click event that lets navigate to specific chosen country
     */
    
    createChart(): void {
      this.pieChart = new Chart('pie-chart', {
        type: 'pie',
  
        data: {
          labels: this.numberOfLabels,
          datasets: [
            {
              data: this.numberOfMedals,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
  
          onClick: (e) => {
            try {
              this.router.navigateByUrl(
                '/' +
                  this.pieChart.getElementsAtEventForMode(
                    e,
                    'nearest',
                    { intersect: true },
                    true
                  )[0].index
              );
            } catch {}
          },
          plugins: {
            legend: {
              display: false,
            }
          },
        },
      });
    }
}
