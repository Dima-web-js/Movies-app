import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailComponent } from './movie-detail.component';
import { MoviesService } from '../../shared/services/movies.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;
  let router: jasmine.SpyObj<Router>;

  const mockMovie: Movie = {
    id: 1,
    name: 'Test Movie',
    alternativeName: 'Alternative Name',
    enName: 'English Name',
    type: 'movie',
    year: 2023,
    description: 'Test description',
    movieLength: 120,
    rating: { kp: 8.5, imdb: 8.0 },
    votes: { kp: 1000, imdb: 2000 },
    poster: { url: 'test.jpg', previewUrl: 'test-preview.jpg' },
    backdrop: { url: 'backdrop.jpg', previewUrl: 'backdrop-preview.jpg' },
    genres: [{ name: 'драма' }, { name: 'триллер' }],
    countries: [{ name: 'США' }],
    persons: [
      {
        id: 1,
        name: 'Director Name',
        profession: 'режиссеры',
        enProfession: 'director',
      },
      {
        id: 2,
        name: 'Actor Name',
        profession: 'актеры',
        enProfession: 'actor',
      },
    ],
    isSeries: false,
    ticketsOnSale: false,
  };

  beforeEach(async () => {
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['getMovieById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    moviesService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie on init', () => {
    moviesService.getMovieById.and.returnValue(of(mockMovie));

    fixture.detectChanges();

    expect(moviesService.getMovieById).toHaveBeenCalledWith(1);
    expect(component.movie()).toEqual(mockMovie);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should handle error when loading movie', () => {
    const errorMessage = 'Test error';
    moviesService.getMovieById.and.returnValue(throwError(() => new Error(errorMessage)));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(errorMessage);
    expect(component.movie()).toBeNull();
  });

  it('should navigate to home if no id provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        { provide: MoviesService, useValue: moviesService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  describe('getters', () => {
    beforeEach(() => {
      moviesService.getMovieById.and.returnValue(of(mockMovie));
      component.ngOnInit();
    });

    it('should return poster url', () => {
      expect(component.posterUrl).toBe('test.jpg');
    });

    it('should return backdrop url', () => {
      expect(component.backdropUrl).toBe('backdrop.jpg');
    });

    it('should return display title', () => {
      expect(component.displayTitle).toBe('Test Movie');
    });

    it('should return rating', () => {
      expect(component.rating).toBe(8.5);
    });

    it('should return genres as string', () => {
      expect(component.genres).toBe('драма, триллер');
    });

    it('should return countries as string', () => {
      expect(component.countries).toBe('США');
    });

    it('should return directors', () => {
      expect(component.directors).toBe('Director Name');
    });

    it('should return actors', () => {
      expect(component.actors).toBe('Actor Name');
    });
  });

  describe('getters with null/empty data', () => {
    beforeEach(() => {
      const movieWithoutData: Movie = {
        ...mockMovie,
        poster: {},
        backdrop: {},
        persons: [],
      };
      moviesService.getMovieById.and.returnValue(of(movieWithoutData));
      component.ngOnInit();
    });

    it('should return placeholder for poster url', () => {
      expect(component.posterUrl).toBe('/placeholder.jpg');
    });

    it('should return null for backdrop url', () => {
      expect(component.backdropUrl).toBeNull();
    });

    it('should return empty string for directors', () => {
      expect(component.directors).toBe('');
    });

    it('should return empty string for actors', () => {
      expect(component.actors).toBe('');
    });
  });

  it('should return alternative name if name is not available', () => {
    const movieWithAltName: Movie = {
      ...mockMovie,
      name: undefined,
    };
    moviesService.getMovieById.and.returnValue(of(movieWithAltName));
    component.ngOnInit();

    expect(component.displayTitle).toBe('Alternative Name');
  });

  it('should return imdb rating if kp is not available', () => {
    const movieWithImdbRating: Movie = {
      ...mockMovie,
      rating: { imdb: 7.5 },
    };
    moviesService.getMovieById.and.returnValue(of(movieWithImdbRating));
    component.ngOnInit();

    expect(component.rating).toBe(7.5);
  });

  it('should limit actors to 10', () => {
    const manyActors = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      name: `Actor ${i}`,
      profession: 'актеры',
      enProfession: 'actor',
    }));

    const movieWithManyActors: Movie = {
      ...mockMovie,
      persons: manyActors,
    };
    moviesService.getMovieById.and.returnValue(of(movieWithManyActors));
    component.ngOnInit();

    const actorsList = component.actors.split(', ');
    expect(actorsList.length).toBe(10);
  });
});

