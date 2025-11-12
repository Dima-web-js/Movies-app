import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';
import { MoviesService } from '../../shared/services/movies.service';
import { of, throwError } from 'rxjs';
import { Movie, MoviesResponse } from '../../shared/models/movie.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;

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

  beforeEach(async () => {
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'getMovies',
      'searchMovies',
    ]);

    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    moviesService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    moviesService.getMovies.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(moviesService.getMovies).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(component.movies().length).toBe(1);
    expect(component.movies()[0].name).toBe('Test Movie');
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should handle error when loading movies', () => {
    const errorMessage = 'Test error';
    moviesService.getMovies.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(errorMessage);
    expect(component.movies().length).toBe(0);
  });

  it('should search movies when onSearch is called', () => {
    moviesService.searchMovies.and.returnValue(of(mockResponse));

    component.onSearch('Test query');

    expect(component.searchQuery()).toBe('Test query');
    expect(component.currentPage()).toBe(1);
    expect(moviesService.searchMovies).toHaveBeenCalledWith('Test query', 1, 20);
  });

  it('should load movies without search when query is empty', () => {
    moviesService.getMovies.and.returnValue(of(mockResponse));

    component.onSearch('');

    expect(component.searchQuery()).toBe('');
    expect(moviesService.getMovies).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('should change page and reload movies', () => {
    moviesService.getMovies.and.returnValue(of(mockResponse));
    spyOn(window, 'scrollTo');

    component.onPageChange(3);

    expect(component.currentPage()).toBe(3);
    expect(moviesService.getMovies).toHaveBeenCalledWith({ page: 3, limit: 20 });
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should set loading state correctly', (done) => {
    moviesService.getMovies.and.returnValue(of(mockResponse));

    expect(component.loading()).toBe(false);

    component.loadMovies();

    // Loading is set synchronously, then cleared after subscribe
    setTimeout(() => {
      expect(component.loading()).toBe(false);
      done();
    }, 0);
  });

  it('should calculate visible pages correctly', () => {
    component.currentPage.set(1);
    component.totalPages.set(10);

    const pages = component.visiblePages;

    expect(pages).toContain(1);
    expect(pages).toContain(-1); // dots
    expect(pages).toContain(10);
  });

  it('should calculate visible pages for middle page', () => {
    component.currentPage.set(5);
    component.totalPages.set(10);

    const pages = component.visiblePages;

    expect(pages).toContain(1);
    expect(pages).toContain(3);
    expect(pages).toContain(4);
    expect(pages).toContain(5);
    expect(pages).toContain(6);
    expect(pages).toContain(7);
    expect(pages).toContain(10);
  });

  it('should set totalPages to at least 1', () => {
    const emptyResponse: MoviesResponse = {
      docs: [],
      total: 0,
      limit: 20,
      page: 1,
      pages: 0,
    };
    moviesService.getMovies.and.returnValue(of(emptyResponse));

    fixture.detectChanges();

    expect(component.totalPages()).toBe(1);
  });
});
