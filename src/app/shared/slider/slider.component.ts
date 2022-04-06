import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @ViewChild('sliderRef', {static: true}) sliderRef!: ElementRef;
  rightArrowIcon = faChevronRight;
  leftArrowIcon = faChevronLeft;
  
  ngOnInit(): void {
    this.onSliderScrollHandler();
  }
  
  onSliderScrollHandler() {
    const productContainers =(this.sliderRef.nativeElement as HTMLElement).querySelector('.slider-container');
    const nxtBtn =(this.sliderRef.nativeElement as HTMLElement).querySelector('.nxt-btn');
    const preBtn =(this.sliderRef.nativeElement as HTMLElement).querySelector('.pre-btn');
  
    let containerDimensions = productContainers!.getBoundingClientRect();
    let containerWidth = containerDimensions.width;
  
    nxtBtn!.addEventListener('click', () => {
      productContainers!.scrollLeft += containerWidth;
    })
  
    preBtn!.addEventListener('click', () => {
      productContainers!.scrollLeft -= containerWidth;
    })   
  }

}



