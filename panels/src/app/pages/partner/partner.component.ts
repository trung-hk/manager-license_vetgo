import { AfterViewInit, Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements AfterViewInit {
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
      'assets/js/page/distributor-menu.js',
      'assets/js/page/partner.js'
    ]).then();
    // .then(() => this.communicationService.sendEventToJs('AgentComponent', {type: 'INITIAL_DATA' }));
  }
}