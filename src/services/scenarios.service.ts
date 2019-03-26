import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericResult } from 'src/model/generic-result.model';

@Injectable({
  providedIn: 'root'
})
export class ScenariosService {

  constructor(private http: HttpClient) { }

  runAction(uri: string) {
    return this.http.get<GenericResult>(uri);
  }
}
