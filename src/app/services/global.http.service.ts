import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpService {

  //public readonly baseUrl = 'http://milenial.ddns.net:4200'; //server
  public readonly baseUrl = 'http://localhost:3200'; //local

  constructor() { }

  public handelErrors(error: HttpErrorResponse): Observable<any>{
    return throwError(error.message);
  }
}
