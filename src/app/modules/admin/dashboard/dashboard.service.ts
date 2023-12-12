import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DashboardService {

    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    getData(): Observable<any> {

        //TODO : replace with a method to retrieve all the data of the project
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            }),
        );
    }
}
