export interface Movie {
  id: number;
  name?: string;
  alternativeName?: string;
  enName?: string;
  type: string;
  year: number;
  description?: string;
  shortDescription?: string;
  status?: string;
  rating: Rating;
  votes: Votes;
  movieLength?: number;
  totalSeriesLength?: number;
  seriesLength?: number;
  ratingMpaa?: string;
  ageRating?: number;
  poster: Poster;
  backdrop?: Backdrop;
  genres: Genre[];
  countries: Country[];
  names?: MovieName[];
  persons?: Person[];
  reviewInfo?: ReviewInfo;
  seasonsInfo?: SeasonInfo[];
  budget?: Budget;
  fees?: Fees;
  premiere?: Premiere;
  similarMovies?: SimilarMovie[];
  sequelsAndPrequels?: SequelAndPrequel[];
  watchability?: Watchability;
  releaseYears?: ReleaseYear[];
  top10?: number;
  top250?: number;
  isSeries: boolean;
  ticketsOnSale: boolean;
  typeNumber?: number;
  externalId?: ExternalId;
  logo?: MovieLogo;
}

export interface Rating {
  kp?: number;
  imdb?: number;
  filmCritics?: number;
  russianFilmCritics?: number;
  await?: number;
}

export interface Votes {
  kp?: number;
  imdb?: number;
  filmCritics?: number;
  russianFilmCritics?: number;
  await?: number;
}

export interface Poster {
  url?: string;
  previewUrl?: string;
}

export interface Backdrop {
  url?: string;
  previewUrl?: string;
}

export interface Genre {
  name: string;
}

export interface Country {
  name: string;
}

export interface Person {
  id: number;
  photo?: string;
  name?: string;
  enName?: string;
  description?: string;
  profession?: string;
  enProfession?: string;
}

export interface ReviewInfo {
  count: number;
  positiveCount: number;
  percentage: string;
}

export interface SeasonInfo {
  number: number;
  episodesCount: number;
}

export interface Budget {
  value: number;
  currency: string;
}

export interface Fees {
  world?: FeesItem;
  russia?: FeesItem;
  usa?: FeesItem;
}

export interface FeesItem {
  value: number;
  currency: string;
}

export interface Premiere {
  country?: string;
  world?: string;
  russia?: string;
  digital?: string;
  cinema?: string;
  bluray?: string;
  dvd?: string;
}

export interface SimilarMovie {
  id: number;
  name?: string;
  enName?: string;
  alternativeName?: string;
  type: string;
  poster?: Poster;
}

export interface SequelAndPrequel {
  id: number;
  name?: string;
  enName?: string;
  alternativeName?: string;
  type: string;
  poster?: Poster;
}

export interface Watchability {
  items?: WatchabilityItem[];
}

export interface WatchabilityItem {
  name: string;
  logo: Logo;
  url: string;
}

export interface Logo {
  url: string;
}

export interface MovieLogo {
  url?: string;
  previewUrl?: string;
}

export interface ReleaseYear {
  start: number;
  end: number;
}

export interface MovieName {
  name: string;
  language?: string;
  type?: string;
}

export interface ExternalId {
  imdb?: string;
  tmdb?: number;
  kpHD?: string | null;
}

export interface MoviesResponse {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface MovieSearchParams {
  page?: number;
  limit?: number;
  query?: string;
  year?: string;
  'rating.kp'?: string;
  'rating.imdb'?: string;
  'genres.name'?: string | string[];
  'countries.name'?: string | string[];
  type?: string;
  isSeries?: boolean;
  sortField?: string[];
  sortType?: string[];
}

