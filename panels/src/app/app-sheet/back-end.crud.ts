import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap, Observable, retryWhen, throwError, timer } from "rxjs";
import { map } from 'rxjs/operators';
import { apiCacheUrl, getSalt } from "../utils/db-utils";
interface CacheResponse<T> {
  status: 'SUCCESS' | 'FAILED';
  msg: string;
  data: T;
}
let maxRetryAttempts = 15;
let retryDelay = 3000; // milliseconds
export class BackEndCrud<T> {
  headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  url: string;
  license ;
   constructor(
    protected http: HttpClient,
    protected id: string
  ) {
    this.url =  atob(apiCacheUrl()).replace('${appId}', id);
    this.license = id;
  }
  public getLicense() {
    return this.license;
  }
  public add(table: string, data: T): Observable<T> {
    let retryAttempts = 0;
    const obj = {
      actionType: 'POST',
      table,
      sheetId: this.license,
      data,
      ...getSalt(),
    };
    return this.http
      .post<CacheResponse<T>>(this.url, obj, { headers: this.headers })
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap(error => {
              if (++retryAttempts <= maxRetryAttempts) {
                console.log(`Retry attempt #${retryAttempts}`);
                return timer(retryDelay);
              }
              return throwError('Max retry attempts reached');
            })
          )
        )
      )
      .pipe(map((it) => it.data));
  }
  // add list data , if id exits on database will update
  public addAll(table: string,data: T[]): Observable<T[]> {
    let retryAttempts = 0;
    const obj = {
      actionType: 'addAll',
      table,
      sheetId: this.license,
      data,
      ...getSalt(),
    };
    return this.http.post<T[]>(this.url, obj, { headers: this.headers }) .pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (++retryAttempts <= maxRetryAttempts) {
              console.log(`Retry attempt #${retryAttempts}`);
              return timer(retryDelay);
            }
            return throwError('Max retry attempts reached');
          })
        )
      )
    );
  }
  public update(table: string,data: T, id: string): Observable<T> {
    let retryAttempts = 0;
    console.log(id); // keep id
    const obj = {
      actionType: 'POST',
      table,
      ...getSalt(),
      data,
    };
    return this.http
      .post<CacheResponse<T>>(this.url, obj, { headers: this.headers })
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap(error => {
              if (++retryAttempts <= maxRetryAttempts) {
                console.log(`Retry attempt #${retryAttempts}`);
                return timer(retryDelay);
              }
              return throwError('Max retry attempts reached');
            })
          )
        )
      )
      .pipe(map((it) => it.data));
  }
  public getById(table: string,id: string): Observable<T> {
    let retryAttempts = 0;
    const obj = {
      actionType: 'getById',
      table,
      id,
      ...getSalt(),
    };
    return this.http
      .post<CacheResponse<T>>(this.url, obj, { headers: this.headers })
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap(error => {
              if (++retryAttempts <= maxRetryAttempts) {
                console.log(`Retry attempt #${retryAttempts}`);
                return timer(retryDelay);
              }
              return throwError('Max retry attempts reached');
            })
          )
        )
      )
      .pipe(map((it) => it.data));
  }
  // will remove table
  public clearData(table: string): Observable<CacheResponse<T>> {
    let retryAttempts = 0;
    const obj = {
      actionType: 'CLEAR',
      table,
      ...getSalt(),
    };
    return this.http.post<CacheResponse<T>>(this.url, obj, {
      headers: this.headers,
    }).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (++retryAttempts <= maxRetryAttempts) {
              console.log(`Retry attempt #${retryAttempts}`);
              return timer(retryDelay);
            }
            return throwError('Max retry attempts reached');
          })
        )
      )
    );
  }
  public deleteById(table: string,id: string): Observable<CacheResponse<T>> {
    let retryAttempts = 0;
    const obj = {
      actionType: 'DELETE',
      table,
      id,
      ...getSalt(),
    };
    return this.http.post<CacheResponse<T>>(this.url, obj, {
      headers: this.headers,
    }).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (++retryAttempts <= maxRetryAttempts) {
              console.log(`Retry attempt #${retryAttempts}`);
              return timer(retryDelay);
            }
            return throwError('Max retry attempts reached');
          })
        )
      )
    );
  }

  public getAll(table: string): Observable<T[]> {
    const obj = {
      actionType: 'GET',
      table,
      ...getSalt(),
    };
    let retryAttempts = 0;
    return this.http.post<T[]>(this.url, obj, { headers: this.headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (++retryAttempts <= maxRetryAttempts) {
              console.log(`Retry attempt #${retryAttempts}`);
              return timer(retryDelay);
            }
            return throwError('Max retry attempts reached');
          })
        )
      )
    );
  }
  public getBySeqNo(table: string, seqNo: number): Observable<T[]> {
    const obj = {
      actionType: 'GET',
      table,
      ...getSalt(),
      seqNo
    };
    let retryAttempts = 0;
    return this.http.post<T[]>(this.url, obj, { headers: this.headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (++retryAttempts <= maxRetryAttempts) {
              console.log(`Retry attempt #${retryAttempts}`);
              return timer(retryDelay);
            }
            return throwError('Max retry attempts reached');
          })
        )
      )
    );
  }
}
