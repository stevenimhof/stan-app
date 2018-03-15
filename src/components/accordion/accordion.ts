import { Component, Input } from '@angular/core';

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent {

  @Input('headline') headline : any;
  @Input('collapsed') collapsed : any;

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
