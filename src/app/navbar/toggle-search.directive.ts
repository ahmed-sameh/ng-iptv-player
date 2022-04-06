import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleSearch]'
})
export class ToggleSearchDirective {

  constructor(private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('click') searchToggle() {
    const formEl = (this.render.parentNode(this.elRef.nativeElement) as HTMLElement).querySelector('.search-form')

    if(formEl!.classList.contains('show')){
      this.render.removeClass(formEl, 'show');
    }else{
      this.render.addClass(formEl, 'show')
    }
  }
}
