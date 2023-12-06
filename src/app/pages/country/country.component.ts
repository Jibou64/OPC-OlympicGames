import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CountryComponent implements OnInit, OnDestroy {
  country!: Olympic;
  olympics$!: Observable<Array<Olympic>>;
  countryId!: number;
  lineChart: any;
  numberOfLabels: Array<number> = [];
  numberOfMedals: Array<number> = [];
  totalMedals: number = 0;
  totalAthletes: number = 0;
  subscription!: Subscription;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
// Permet l'initialisation au début de la page pour récupérer nos valeurs et qu'elles s'affichent correctement
  ngOnInit(): void {
    this.countryId = +this.route.snapshot.params['id'];
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((value) =>
      this.modifyChartData(value)
    );
  }
//Permet de supprimer les données une fois le navigateur fermé.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 /**
   * Function to get our chart with differents labels used
   * 
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
   * Function to get our number of athletes
   *
   * @param participations - The stream of datas from olympic.participations
   * @param countryId - The stream of datas concerning countries from olympics
   * @param numberOfLabels - Count number of labels registered from our data
   * @param numberOfMedals - Count the number of Medals registered from our data
   * @param totalAthletes - Count the number of Athmetes registered from our data
   * @param totalMedals - Count the total number of Medals registered from our data
   * @param numberOfLabels - Count the number of Labels registered from our data
   */
  modifyChartData(olympics: Array<Olympic>): void {
    if (olympics) {
      const olympic = olympics[this.countryId].participations;
      for (let entry of olympic) {
        this.numberOfLabels.push(entry.year);
        this.numberOfMedals.push(entry.medalsCount);
        this.totalMedals += entry.medalsCount;
        this.totalAthletes += entry.athleteCount;
      }
      this.createChart();
    } else {
      this.router.navigateByUrl('error');
    }
  }

  
  goBackHome(): void {
    this.router.navigateByUrl('');
  }
}