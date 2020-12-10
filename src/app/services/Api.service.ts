import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { GlobalHttpService } from './global.http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Album, Artist, Categories, FileInterface, LoginResp, LoginUser, RegisterUser } from '../models/global.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url = this.globalHttp.baseUrl;

  constructor(
    private http: HttpClient,
    private globalHttp: GlobalHttpService
  ) { }

  create_user(data: RegisterUser): Observable<LoginResp>{
    return this.http.post<LoginResp>(`${this.globalHttp.baseUrl}/auth/local/register`, data)
    .pipe(catchError(error => this.globalHttp.handelErrors(error)));
  }

  login(data: LoginUser): Observable<LoginResp>{
    return this.http.post<LoginResp>(`${this.globalHttp.baseUrl}/auth/local`, data)
    .pipe(catchError(error => this.globalHttp.handelErrors(error)));
  }

  getCategories(name?: string): Observable<Categories[]>{
    return this.http.get<Categories[]>(`${this.url}/categories?_limit=10&_sort=nombre%3AASC&_q=${name}`)
      .pipe(catchError(error => this.globalHttp.handelErrors(error)));
  }

  getArtists(): Observable<Artist[]>{
    return this.http.get<Artist[]>(`${this.url}/artists?_sort=nombre%3AASC`)
    .pipe(catchError(error => this.globalHttp.handelErrors(error)));
  }

  getAlbum(id: string): Observable<Album>{
    return this.http.get<Album>(`${this.url}/albums/${id}`)
    .pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }

  getTrack(name: string): Observable<FileInterface[]>{
    return this.http.get<FileInterface[]>(
      `${this.url}/upload/files?_limit=10&_sort=name%3AASC&&_q=${name}`
      ).pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }

  getAlbumByName(name: string): Observable<Album[]>{
    return this.http.get<Album[]>(`${this.url}/albums?_limit=10&_sort=nombre%3AASC&_q=${name}`)
      .pipe( catchError(error => this.globalHttp.handelErrors(error)));
  }
}