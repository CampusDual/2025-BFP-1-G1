import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  getUserApplications(): Observable<any[]> {
    // Ajusta la URL si tu endpoint es diferente
    return this.http.get<any[]>('/api/applications/user');
  }
  private apiUrl = '/api/applications';

  constructor(private http: HttpClient) {}

  aplicarAOferta(ofertaId: number): Observable<any> {
    // Si usas JWT, añade el token aquí
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Descomenta si usas JWT
    });
    return this.http.post(this.apiUrl, { ofertaId }, { headers });
  }
}