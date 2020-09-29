import { NgModule } from '@angular/core';
import { SearchPipe } from './search/search';
import { SortPipe } from './sort/sort';
import { ReversePipe } from './reverse/reverse';
@NgModule({
	declarations: [SearchPipe,
    SortPipe,
    ReversePipe],
	imports: [],
	exports: [SearchPipe,
    SortPipe,
    ReversePipe]
})
export class PipesModule {}
