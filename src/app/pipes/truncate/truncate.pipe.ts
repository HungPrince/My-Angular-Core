import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name:'truncate'
})

export class TruncatePipe implements PipeTransform {
    transform(value: string, args ?): string {
        console.log(value);
        console.log(args);
        let limit = args > 0 ? parseInt(args) : 10;
        return value.length > limit ? value.substring(0, limit) + '...' : value;
    }
}
