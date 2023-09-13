/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *1
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
const API_CONFIG_APP = "configapps";
const TBL_CUSTOMER = "TBL_CUSTOMER";
const TBL_PACKAGE_PRODUCT = "TBL_PACKAGE_PRODUCT";
const TBL_AGENT = "TBL_AGENT";
const TBL_AGENT_PRODUCT = "TBL_AGENT_PRODUCT";
const TBL_DISTRIBUTOR = "TBL_DISTRIBUTOR";
const TBL_PARTNER = "TBL_PARTNER";
const TBL_USER = "TBL_USER";
const TBL_VG_ORDER = "TBL_VG_ORDER";
const STATUS_PRODUCT_SERVICE_DEVELOPED = 0;
const STATUS_PRODUCT_SERVICE_DEVELOPING = 1;
const STATUS_PRODUCT_SERVICE_STOP_DEVELOP = 2;
const TYPE_USER_ADMIN = 0;
const TYPE_USER_AGENT = 1;
const TYPE_USER_DISTRIBUTOR = 2;
const TYPE_USER_PARTNER = 3;
const TYPE_USER_CUSTOMER = 4;
const VG_CODE_ORDER = "VGO";
const STATUS_ORDER_NOT_PAID = 0;
const STATUS_ORDER_PAID = 1;
const STATUS_CONFIG_APP_NOT_ACTIVE = 0;
const STATUS_CONFIG_APP_ACTIVE = 1;
const STATUS_PRODUCT_SERVICE_LIST = [
    {value: STATUS_PRODUCT_SERVICE_DEVELOPED, name: 'Đã phát triển'},
    {value: STATUS_PRODUCT_SERVICE_DEVELOPING, name: 'Đang phát triển'},
    {value: STATUS_PRODUCT_SERVICE_STOP_DEVELOP, name: 'Ngừng phát triển'}];
const TYPE_PRODUCT_SERVICE = 1;
const VETGO_TOKEN = "VETGODEV";
var vetgoDB = {
    url: 'http://localhost:8080/api',
    getAll: (table) => {
        return window.axios.get(`${vetgoDB.url}/${table}`)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    },
    getById: (id, table) => {
        return window.axios.get(`${vetgoDB.url}/${table}/${id}`)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    },
    add: (data, table) => {
        return window.axios.post(`${vetgoDB.url}/${table}`, data)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                return null;
            });
    },
    update: (data, table) => {
        return window.axios.put(`${vetgoDB.url}/${table}/${data.id}`, data)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                return null;
            });
    },
    deleteById: (id, table) => {
        return window.axios.delete(`${vetgoDB.url}/${table}/${id}`)
            .then()
            .catch((error) => {
                console.error(error);
            });
    }
}
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
  `,
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

