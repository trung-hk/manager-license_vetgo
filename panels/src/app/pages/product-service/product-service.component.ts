import { AfterViewInit, Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';

@Component({
  selector: 'app-product-service',
  templateUrl: './product-service.component.html',
})
export class ProductServiceComponent implements AfterViewInit {
  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) { }

  ngAfterViewInit(): void {
    this.loadScript.addListScript([
      'assets/js/app.min.js',
      'assets/js/scripts.js',
      'assets/js/appScript.js',
      'assets/bundles/datatables/datatables.min.js',
      'assets/bundles/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js',
      'assets/bundles/jquery-ui/jquery-ui.min.js',
      'assets/js/page/datatables.js',
      'assets/bundles/izitoast/js/iziToast.min.js',
      'assets/js/page/toastr.js',
      'assets/js/page/product-menu.js',
      'assets/js/page/product-service.js'
    ]).then();
    // .then(() => this.communicationService.sendEventToJs('AgentComponent', {type: 'INITIAL_DATA' }));
  }
}
