import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { HttpClient } from '@angular/common/http';
import { urlEndpoint } from '../utils/constant';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http:HttpClient, private storageService: StorageService) { }

  sendEmail(mail: any): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      `${urlEndpoint.baseUrl}/email/sendEmail`,
      mail
    );
  }
}
