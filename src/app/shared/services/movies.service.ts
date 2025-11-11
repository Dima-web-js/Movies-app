import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Movie, MoviesResponse, MovieSearchParams } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.poiskkino.dev/v1.4';

  // Получение списка фильмов с пагинацией
  getMovies(params: MovieSearchParams = {}): Observable<MoviesResponse> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            httpParams = httpParams.append(key, v.toString());
          });
        } else {
          httpParams = httpParams.append(key, value.toString());
        }
      }
    });

    return this.http.get<MoviesResponse>(`${this.apiUrl}/movie`, { params: httpParams }).pipe(
      catchError((error) => {
        console.error('Error fetching movies:', error);
        return throwError(() => new Error('Не удалось загрузить список фильмов'));
      })
    );
  }

  // Получение информации о фильме по его ID
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching movie:', error);
        return throwError(() => new Error('Не удалось загрузить информацию о фильме'));
      })
    );
  }

  // Поиск фильмов по запросу
  searchMovies(query: string, page: number = 1, limit: number = 20): Observable<MoviesResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MoviesResponse>(`${this.apiUrl}/movie/search`, { params }).pipe(
      catchError((error) => {
        console.error('Error searching movies:', error);
        return throwError(() => new Error('Не удалось найти фильмы по запросу'));
      })
    );
  }
}

