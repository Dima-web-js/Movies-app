import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  searchQuery = '';
  searchChange = output<string>();

  onSearch(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onInput(): void {
    if (this.searchQuery.trim() === '') {
      this.searchChange.emit('');
    }
  }
}
