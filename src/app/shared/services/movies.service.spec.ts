import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoviesService } from './movies.service';
import { Movie, MoviesResponse } from '../models/movie.model';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api.poiskkino.dev/v1.4';

  const mockMovie: Movie = {
    id: 1,
    name: 'Test Movie',
    alternativeName: 'Alternative',
    enName: 'English Name',
    type: 'movie',
    year: 2023,
    description: 'Test description',
    rating: { kp: 8.5, imdb: 8.0 },
    votes: { kp: 1000, imdb: 2000 },
    poster: { url: 'test.jpg', previewUrl: 'test-preview.jpg' },
    genres: [{ name: 'драма' }],
    countries: [{ name: 'США' }],
    isSeries: false,
    ticketsOnSale: false,
  };

  const mockResponse: MoviesResponse = {
    docs: [mockMovie],
    total: 100,
    limit: 20,
    page: 1,
    pages: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService],
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMovies', () => {
    it('should fetch movies with default params', () => {
      service.getMovies().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.docs.length).toBe(1);
        expect(response.docs[0].name).toBe('Test Movie');
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${apiUrl}/movie`;
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch movies with pagination params', () => {
      service.getMovies({ page: 2, limit: 10 }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${apiUrl}/movie` &&
          request.params.get('page') === '2' &&
          request.params.get('limit') === '10'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when fetching movies', () => {
      service.getMovies().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Не удалось загрузить список фильмов');
        },
      });

      const req = httpMock.expectOne((request) => request.url === `${apiUrl}/movie`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getMovieById', () => {
    it('should fetch movie by id', () => {
      const movieId = 1;

      service.getMovieById(movieId).subscribe((movie) => {
        expect(movie).toEqual(mockMovie);
        expect(movie.id).toBe(movieId);
      });

      const req = httpMock.expectOne(`${apiUrl}/movie/${movieId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovie);
    });

    it('should handle error when fetching movie by id', () => {
      const movieId = 999;

      service.getMovieById(movieId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Не удалось загрузить информацию о фильме');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/movie/${movieId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchMovies', () => {
    it('should search movies by query', () => {
      const query = 'Test';

      service.searchMovies(query).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${apiUrl}/movie/search` &&
          request.params.get('query') === query &&
          request.params.get('page') === '1' &&
          request.params.get('limit') === '20'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should search movies with custom pagination', () => {
      const query = 'Test';
      const page = 3;
      const limit = 15;

      service.searchMovies(query, page, limit).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${apiUrl}/movie/search` &&
          request.params.get('query') === query &&
          request.params.get('page') === page.toString() &&
          request.params.get('limit') === limit.toString()
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when searching movies', () => {
      const query = 'Test';

      service.searchMovies(query).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Не удалось найти фильмы по запросу');
        },
      });

      const req = httpMock.expectOne((request) => request.url === `${apiUrl}/movie/search`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});

