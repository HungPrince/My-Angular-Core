import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncatePipe } from './truncate/truncate.pipe';
import { Safe } from './safe-html/safe-html.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TruncatePipe,
        Safe
    ],
    exports: [
        TruncatePipe,
        Safe
    ]
})
export class PipesModule { }
