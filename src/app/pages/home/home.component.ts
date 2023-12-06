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

  constructor(private olympicService: OlympicService, private router: Router) {}



  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((value) => {
      this.modifyChartData(value);
    });
  }

  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
