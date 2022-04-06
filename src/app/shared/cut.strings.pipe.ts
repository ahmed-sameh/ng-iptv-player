import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'cutLongString'})
export class cutStringsPipe implements PipeTransform {
  transform(value: string) {
    if(value.length > 27) {
      return `${value.substring(0,27)}...`
    }else{
      return value
    }
  }

}