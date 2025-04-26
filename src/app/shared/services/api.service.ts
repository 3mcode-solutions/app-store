import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * طلب GET للحصول على البيانات
   * @param path مسار API
   * @param params معلمات الاستعلام (اختياري)
   * @returns Observable مع البيانات المطلوبة
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * طلب POST لإنشاء بيانات جديدة
   * @param path مسار API
   * @param body البيانات المراد إرسالها
   * @returns Observable مع البيانات المنشأة
   */
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * طلب PUT لتحديث بيانات موجودة
   * @param path مسار API
   * @param body البيانات المراد تحديثها
   * @returns Observable مع البيانات المحدثة
   */
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * طلب PATCH لتحديث جزء من البيانات
   * @param path مسار API
   * @param body البيانات المراد تحديثها
   * @returns Observable مع البيانات المحدثة
   */
  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${path}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * طلب DELETE لحذف بيانات
   * @param path مسار API
   * @returns Observable مع نتيجة الحذف
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${path}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * معالجة الأخطاء
   * @param error الخطأ المستلم
   * @returns Observable مع رسالة الخطأ
   */
  private handleError(error: any) {
    let errorMessage = 'حدث خطأ في الاتصال بالخادم';
    
    if (error.error instanceof ErrorEvent) {
      // خطأ في الشبكة
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // خطأ من الخادم
      errorMessage = `رمز الخطأ: ${error.status}\nرسالة: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
