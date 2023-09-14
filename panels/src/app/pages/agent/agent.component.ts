import { AfterViewInit, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyLoadScriptService } from "../../services/lazy-load-script.service";
import { CommunicationService } from "../../services/communication.service";
import { BackEndCrud } from 'src/app/app-sheet/back-end.crud';
import { Agent } from 'src/app/models/agent';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html'
})
export class AgentComponent implements AfterViewInit {
  http = inject(HttpClient);
  apiSheet = new BackEndCrud<Agent>(this.http, 'AKfycbzC9sSxdtHmTpbzOBMNcOwBV8D36PUOEehuM4XlKe2_B9eNhmrJOf8LRWIv-nYN2LG4');
  // data: Agent[] = [];
  // currentPage = 1;
  // pageSize = 10;
  // sort = 'id';

  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) {
    this.communicationService.listenChange('LOAD-PAGE').subscribe(data => {
      console.log(data);
    })


  }
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
      'assets/js/page/agent-menu.js',
      'assets/js/page/agent-list.js'
    ])
    .then(() => this.communicationService.sendEventToJs('AgentComponent', {type: 'INITIAL_DATA' }));
  }

  createAgent() {
    this.communicationService.sendEventToJs('AgentComponent', {type: 'SAVE_DATA' });
  }
}
