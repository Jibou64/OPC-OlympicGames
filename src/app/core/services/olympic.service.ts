import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';
import { ReturnStatement } from '@angular/compiler';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  /**
   * Generate datas from our DataBase within the mock
   *
   * @param olympicUrl - The array of olympics retrieved by service
   */
  loadInitialData() {
    return this.http.get<Array<Olympic>>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }


  /**
   * Function to get our data as obersevables
   *
   * @param olympics$ - The stream of datas from olympic
   */
  getOlympics():Observable<Array<Olympic>> {
    return this.olympics$.asObservable()
  }



   /**
   * Function to get our number of medals
   *
   * @param participation - The stream of datas from participation
   */
  countMedals(olympic: Olympic): number {
    let medals: number = 0;

    for (let participation of olympic.participations){
      medals += participation.medalsCount
    }
    return medals
  }


   /**
   * Function to get our number of athletes
   *
   * @param participations - The stream of datas from olympic.participations
   * 
   */
  numberParticipants(olympic: Olympic): number {
    let athletes = 0;
    let idAthlete = 0;

    for (let athlete of olympic.participations){
      athletes = athlete.athleteCount
    }
    return athletes
  }

   /**
   * Function to get our number of games
   *
   * @param olympics - The stream of datas from olympic
   * 
   */
  countGames(olympics: Array<Olympic> | null): number {
    var setOlympic = new Set<number>();
    if (olympics){
      for(let olympic of olympics){
        for(let participation of olympic.participations){
          setOlympic.add(participation.year)
        }
      }
    return setOlympic.size;
    }
    else {
      return 0;
    }
  }




  

}
