import {AfterViewInit, Component} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html'
})
export class AgentComponent implements AfterViewInit{
  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) {
    this.communicationService.listenChange('LOAD-PAGE').subscribe( data =>  {
      console.log(data);
      }
    )
  }
  ngAfterViewInit(): void {
    // vd javascript
    // window.communication.listenChange('LOAD-DATA-JS' , (data) => {
    //   console.log(data);
    // })
    setTimeout( (  ) => {
      this.communicationService.sendEventToJs('LOAD-DATA-JS' , {userName: "userName"});
    }, 10000)
    this.loadScript.addListScript([
      'assets/js/app.min.js',
      'assets/js/scripts.js',
      'assets/js/appScript.js',
      'assets/bundles/datatables/datatables.min.js',
      'assets/bundles/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js',
      'assets/bundles/jquery-ui/jquery-ui.min.js',
      'assets/js/page/datatables.js',
      'assets/bundles/izitoast/js/iziToast.min.js' ,
      'assets/js/page/toastr.js',
      'assets/js/page/agent-menu.js',
      'assets/js/page/agent-list.js'
    ]).then();

  }

}
