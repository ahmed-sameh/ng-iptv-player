import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'dashedCatName'})
export class DashedCatNamePipe implements PipeTransform {
  transform(value: string) {
    if(value) {
      if(value.includes('_')) {
        return value.replaceAll('_',' ')
      }else if(value.includes('-')) {
        return value.replaceAll('-',' ')
      }
    }

    return value
  }
}