import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MoviesService } from '../../shared/services/movies.service';
import { Movie } from '../../shared/models/movie.model';
import { SearchBarComponent } from '../../shared/ui/search-bar/search-bar.component';
import { MovieCardComponent } from '../../shared/ui/movie-card/movie-card.component';

@Component({
  selector: 'app-main-page',
  imports: [SearchBarComponent, MovieCardComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private readonly moviesService = inject(MoviesService);

  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  searchQuery = signal('');

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set(null);

    const page = this.currentPage();
    const limit = 20;
    const query = this.searchQuery().trim();

    const request$ =
      query.length > 0
        ? this.moviesService.searchMovies(query, page, limit)
        : this.moviesService.getMovies({ page, limit });

    request$.subscribe({
      next: (response) => {
        this.movies.set(response.docs);
        this.totalPages.set(Math.max(response.pages, 1));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Произошла ошибка при загрузке фильмов');
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadMovies();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get visiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push(-1, total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  }

  // TrackBy function for performance optimization
  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  // TrackBy function for pagination
  trackByPageNumber(index: number, page: number): number {
    return page;
  }
}
