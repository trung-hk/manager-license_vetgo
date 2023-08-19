/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";
String.prototype.format = function () {
    let str = this.toString();
    for (let i = 0; i < arguments.length; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};
const corporate = location.hostname.split(".")[0];
const urlAppScript = "https://script.google.com/macros/s/{0}/exec";
const TBL_PRODUCT = "TBL_PRODUCT";
const TBL_CATEGORIES = "TBL_CATEGORIES";
const TBL_CONFIG_APP = "TBL_CONFIG_APP";
const TBL_CUSTOMER = "TBL_CUSTOMER";
const VETGO_TOKEN = "VETGODEV";
var vetgoSheet = {
    table: 'draft',
    sheetId: corporate === "localhost" ? "AKfycbzC9sSxdtHmTpbzOBMNcOwBV8D36PUOEehuM4XlKe2_B9eNhmrJOf8LRWIv-nYN2LG4" : null,
    doc: `
  // set table work on
    vetgo.sheet.table = 'users';
    // add item
    vetgo.sheet.add({id: 1 , userName: "Thanh" , pass:"123"}).then();
    vetgo.sheet.update({id: 1 , userName: "Thanh2" , pass:"123"}).then();
    vetgo.sheet.getById(1).then( (item) => console.log(item))
    vetgo.sheet.getAll(1).then( (item) => console.log(item))
    vetgo.sheet.deleteById(1).then( (item) => console.log(item))
    // remove table users
    vetgo.sheet.clearData().then()
     // use with await/ async 
         setTimeout(async () => { 
            const item = await vetgo.sheet.getAll();
            console.log(item);
         }, 0)
  ` ,
    add: (data, table) => {
        const obj = {
            actionType: 'POST',
            table: table || vetgoSheet.table,
            data,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response.data);
    },
    addAll: (data, table) => {
        const obj = {
            actionType: 'addAll',
            table: table || vetgoSheet.table,
            data,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response);
    },
    getAll: (table) => {
        const obj = {
            actionType: 'GET',
            table: table || vetgoSheet.table,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response);
    },
    update: (data, table) => {
        const obj = {
            actionType: 'POST',
            table: table || vetgoSheet.table,
            data,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response.data);
    },
    getById: (id, table) => {
        const obj = {
            actionType: 'getById',
            table: table || vetgoSheet.table,
            id,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response.data);
    },
    uploadImg: (base64, name, type) => {
        const obj = {
            actionType: 'UPLOAD',
            base64,
            type,
            name,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response.data);
    },
    clearData: (table) => {
        const obj = {
            actionType: 'CLEAR',
            table: table || vetgoSheet.table,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response);
    },
    deleteById: (id, table) => {
        const obj = {
            actionType: 'DELETE',
            table: table || vetgoSheet.table,
            id,
            csrfToken: VETGO_TOKEN,
        };
        return vetgoSheet.post(obj)
            .then(response => response);
    },
    post: async (data, maxRetries = 5) => {
        for (let retry = 0; retry < maxRetries; retry++) {
            try {
                const response = await fetch(urlAppScript.format(vetgoSheet.sheetId), {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }

                });

                const responseData = await response.json();
                return responseData;
            } catch (error) {
                console.error(`Error occurred during retry ${retry + 1}:`, error);
            }
        }

        throw new Error('Max retry limit exceeded');
    }
}

