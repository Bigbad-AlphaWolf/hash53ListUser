import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('fileInput') inputFile: HTMLInputElement;
  title = 'hash53UserID';
  file: File;
  arrayBuffer: any
  fileList: any;
  onLoaded(event: any) {
    if(event.target.files.length)
      this.file = event.target?.files[0];
      console.log(this.file,'event');
      let fileReader = new FileReader();    
      fileReader.readAsArrayBuffer(this.file);     
      fileReader.onload = (e) => {    
          this.arrayBuffer = fileReader.result;    
          var data = new Uint8Array(this.arrayBuffer);    
          var arr = new Array();    
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
          var bstr = arr.join("");    
          var workbook = XLSX.read(bstr, {type:"binary"});    
          var first_sheet_name = workbook.SheetNames[0];    
          var worksheet = workbook.Sheets[first_sheet_name];    
          console.log(XLSX.utils.sheet_to_json(worksheet,{ raw: true } ));    
            var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
                this.fileList = arraylist.map((el: any) => {     
                  console.log(el);
                             
                  return { numero: el.Numero, hash: this.hash53(el.Numero+"")}
                });    
              const ws = XLSX.utils.json_to_sheet(this.fileList);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              XLSX.writeFile(wb, 'test.xlsx')
            }
            fileReader.onerror = function(err: any) {
              // Cannot read file... Do something, e.g. assume column size = 0.
              console.log('err',err);
              
          };   
  }

   hash53 (str, seed = 0) {
    // tslint:disable-next-line: no-bitwise
    let h1 = 0xdeadbeef ^ seed,
      // tslint:disable-next-line: no-bitwise
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      // tslint:disable-next-line: no-bitwise
      h1 = Math.imul(h1 ^ ch, 2654435761);
      // tslint:disable-next-line: no-bitwise
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    // tslint:disable-next-line: no-bitwise
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      // tslint:disable-next-line: no-bitwise
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    // tslint:disable-next-line: no-bitwise
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      // tslint:disable-next-line: no-bitwise
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    // tslint:disable-next-line: no-bitwise
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
}
