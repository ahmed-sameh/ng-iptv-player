import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor(private Render: Renderer2, private elRef: ElementRef) { }

  @HostListener('click') clickHandler() {
    const list = this.Render.nextSibling(this.elRef.nativeElement) as HTMLElement;
    if(list.classList.contains('show')){
      this.Render.removeClass(list, 'show')
    }else {
      this.Render.addClass(list, 'show')
    }
  }
}
