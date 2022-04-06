import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'toUrlParams'})
export class urlParamsTransformPipe implements PipeTransform {
  transform(value: string) {

      if(value.includes('/')) {
        value = value.replace('/','_')
      }
      
      if(value.includes('-')) {
        value = value.replace('-','_')
      }
  
      if(value.includes('[')) {
        value = value.replace('[','_')
      }
  
      if(value.includes(']')) {
        value = value.replace(']','_')
      }
  
      if(value.includes('.')) {
        value = value.replace('.','_')
      }
  
      if(value.includes(' ')) {
        value = value.replaceAll(' ','_')
      }
  
      if(value.includes('  ')) {
        value = value.replaceAll('  ','_')
      }
  
      if(value.includes('__')) {
        value = value.replaceAll('__','_')
      }

    return value
  }
}