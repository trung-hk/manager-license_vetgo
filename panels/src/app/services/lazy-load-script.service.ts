import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadScriptService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) { }

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

public addListScript(scripts: string[]): Promise<void> {
    return new Promise( async rs => {
       for (let i = 0; i < scripts.length; i++) {
         await this.addScript(scripts[i]);
       }
      rs();
    });
  }
public addListCss(scripts: string[]): Promise<void> {
        return new Promise( async rs => {
            for (let i = 0; i < scripts.length; i++) {
                await this.addCss(scripts[i]);
            }
            rs();
        });
 }
 private addCss(url: string): Promise<void> {
        return new Promise( rs => {
            const exits =  document.querySelector(`link[href="${url}"]`);
            if (exits) {
                console.log('url css exits ' + url);
                rs();
            } else {
                const script = this.document.createElement('link');
                script.rel = 'stylesheet';
                script.href = url;
                script.onload = () => {
                    console.log('loaded css ' + url);
                    rs();
                };
                this.document.body.appendChild(script);
            }
        });
    }
 private addScript(url: string): Promise<void> {
   return new Promise( rs => {
    const exits =  document.querySelector(`script[src="${url}"]`);
      if (exits) {
        console.log('url exits ' + url);
        rs();
        } else {
        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
          console.log('loaded ' + url);
          rs();
        };
        this.document.body.appendChild(script);
      }
   });
  }
}
