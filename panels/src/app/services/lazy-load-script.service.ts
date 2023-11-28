import {Injectable, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LazyLoadScriptService {
    constructor(@Inject(DOCUMENT) private readonly document: Document) {
    }
    listScriptCommon = [
        'assets/js/app.min.js',
        'assets/js/scripts.js',
        'assets/js/appScript.js',
        'assets/bundles/datatables/datatables.min.js',
        'assets/bundles/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js',
        'assets/bundles/jquery-ui/jquery-ui.min.js',
        'assets/js/page/datatables.js',
        'assets/bundles/izitoast/js/iziToast.min.js',
        'assets/js/page/toastr.js',
        'assets/js/page/advance-table.js'
    ];

// public removeListScript(scripts: string[]): void {
//   for (let i = 0; i < scripts.length; i++) {
//     const exits =  document.querySelector(`script[src="${scripts[i]}"]`);
//     if(exits) {
//       exits.remove();
//       console.log('removed: ' + scripts[i]);
//     } else {
//       console.log('not exits: ' + scripts[i]);
//     }
//   }
// }
    private loadScriptCommon(): Promise<void> {
        return new Promise(async rs => {
            for (let i = 0; i < this.listScriptCommon.length; i++) {
                await this.addScript(this.listScriptCommon[i]);
            }
            rs();
        });
    }

    public addListScript(scripts: string[]): Promise<void> {
        return new Promise(async rs => {
            await this.loadScriptCommon();
            for (let i = 0; i < scripts.length; i++) {
                await this.addScript(scripts[i]);
            }
            rs();
        });
    }

    public addListCss(css: string[]): void {
        for (let i = 0; i < css.length; i++) {
           this.addCss(css[i]);
        }
    }

    private addCss(url: string): void {
        const exits = document.querySelector(`link[href="${url}"]`);
        if (exits) {
            // console.log('url css exits ' + url);
        } else {
            const script = this.document.createElement('link');
            script.rel = 'stylesheet';
            script.href = url;
            script.onload = () => {
                // console.log('loaded css ' + url);
            };
            this.document.body.appendChild(script);
        }
    }

    private addScript(url: string): Promise<void> {
        return new Promise(rs => {
            const exits = document.querySelector(`script[src="${url}"]`);
            if (exits) {
                // console.log('url exits ' + url);
                rs();
            } else {
                const script = this.document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.onload = () => {
                    // console.log('loaded ' + url);
                    rs();
                };
                this.document.body.appendChild(script);
            }
        });
    }
}
