import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../shared/services/movies.service';
import { Movie } from '../../shared/models/movie.model';

@Component({
  selector: 'app-movie-detail',
  imports: [RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly moviesService = inject(MoviesService);

  movie = signal<Movie | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovie(+id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadMovie(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.moviesService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Не удалось загрузить информацию о фильме');
        this.loading.set(false);
      },
    });
  }

  get posterUrl(): string {
    const movie = this.movie();
    return movie?.poster?.url || movie?.poster?.previewUrl || '/placeholder.jpg';
  }

  get backdropUrl(): string | null {
    const movie = this.movie();
    return movie?.backdrop?.url || movie?.backdrop?.previewUrl || null;
  }

  get displayTitle(): string {
    const movie = this.movie();
    if (!movie) return '';
    return movie.name || movie.alternativeName || movie.enName || 'Без названия';
  }

  get rating(): number | null {
    const movie = this.movie();
    if (!movie) return null;
    return movie.rating?.kp || movie.rating?.imdb || null;
  }

  get genres(): string {
    return this.movie()?.genres?.map((g) => g.name).join(', ') || '';
  }

  get countries(): string {
    return this.movie()?.countries?.map((c) => c.name).join(', ') || '';
  }

  get directors(): string {
    const movie = this.movie();
    if (!movie?.persons) return '';
    return movie.persons
      .filter((p) => p.profession === 'режиссеры' || p.enProfession === 'director')
      .map((p) => p.name || p.enName)
      .join(', ');
  }

  get actors(): string {
    const movie = this.movie();
    if (!movie?.persons) return '';
    return movie.persons
      .filter((p) => p.profession === 'актеры' || p.enProfession === 'actor')
      .slice(0, 10)
      .map((p) => p.name || p.enName)
      .join(', ');
  }
}
