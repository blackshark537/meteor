import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { GlobalHttpService } from './global.http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalResponseInterface } from './global.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly url = this.globalHttp.baseUrl;

  constructor(
    private http: HttpClient,
    private globalHttp: GlobalHttpService
  ) { }

  getCategories(name?: string): Observable<GlobalResponseInterface>{
    return this.http.get<GlobalResponseInterface>(`${this.url}/category/q?name=${name}`)
      .pipe(catchError(error => this.globalHttp.handelErrors(error)));
  }

  getAlbum(id: string): Observable<GlobalResponseInterface>{
    return this.http.get<GlobalResponseInterface>(`${this.url}/album/id=${id}`)
    .pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }

  getTrack(name: string): Observable<GlobalResponseInterface>{
    return this.http.get<GlobalResponseInterface>(
      `${this.url}/track/search/q?name=${name}`
      ).pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }

  getAlbumByName(name: string): Observable<GlobalResponseInterface>{
    return this.http.get<GlobalResponseInterface>(`${this.url}/album/q?name=${name}`)
      .pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }

}
