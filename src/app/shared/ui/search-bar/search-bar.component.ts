import { ChangeDetectionStrategy, Component, OnDestroy, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnDestroy {
  searchQuery = '';
  searchChange = output<string>();
  
  private searchSubject = new Subject<string>();

  constructor() {
    // Debounce search input for 500ms to reduce API calls
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchChange.emit(query);
      });
  }

  onInput(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
}
