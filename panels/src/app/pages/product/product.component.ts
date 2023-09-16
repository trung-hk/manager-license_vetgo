import { AfterViewInit, Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements AfterViewInit {
  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) { }

  ngAfterViewInit(): void {
    this.loadScript.addListScript([
      'assets/js/app.min.js',
      'assets/js/scripts.js',
      'assets/js/appScript.js',
      'assets/js/page/product.js',
      'assets/js/page/product-list.js',
    ]).then();
    // .then(() => this.communicationService.sendEventToJs('AgentComponent', {type: 'INITIAL_DATA' }));
  }
}
