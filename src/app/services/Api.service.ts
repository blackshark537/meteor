import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { GlobalHttpService } from './global.http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Album, Categories, FileInterface } from '../models/global.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url = this.globalHttp.baseUrl;

  constructor(
    private http: HttpClient,
    private globalHttp: GlobalHttpService
  ) { }

  create_user(data: Register): Observable<AuthResp>{
    return this.http.post<AuthResp>(`${this.globalHttp.baseUrl}/auth/local/register`, data);
  }

  login(data: Login): Observable<AuthResp>{
    return this.http.post<AuthResp>(`${this.globalHttp.baseUrl}/auth/local`, data);
  }

  getCategories(name?: string): Observable<Categories[]>{
    return this.http.get<Categories[]>(`${this.url}/categories?_limit=10&_sort=nombre%3AASC&_q=${name}`)
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

interface Register{
  username: string;
  email: string;
  password: string;
}

interface Login{
  identifier: string;
  password: string;
}

interface AuthResp{
  jwt: string;
  user: any
}