import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent {
  movie = input.required<Movie>();

  get displayTitle(): string {
    const movie = this.movie();
    return movie.name || movie.alternativeName || movie.enName || 'Без названия';
  }

  get posterUrl(): string | null {
    return this.movie().poster?.url || this.movie().poster?.previewUrl || null;
  }

  get rating(): number | null {
    const movie = this.movie();
    return movie.rating?.kp || movie.rating?.imdb || null;
  }

  get genres(): string {
    return this.movie().genres?.map((g) => g.name).join(', ') || '';
  }
}
