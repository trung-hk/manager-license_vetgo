"use strict";
var dataMap;
window.communication.listenChange("ConfigAppComponent", (data) => {
    console.log(data);
    switch (data.event) {
        case 'init-data':
            loadDataConfigApp(data.data.content).then();
            break;
        case 'save-data':
            // saveData().then();
            loadDataConfigApp().then();
            break;
    }
});

$("#config-app-table").dataTable({
    order: [[3, 'desc']],
    columnDefs: [
        {sortable: false, targets: [0, 1, 2, 5]},
        {width: "480px", targets: [0, 1]},
        {width: "70px", targets: [2]},
        {width: "105px", targets: [3]},
        {width: "70px", targets: [4]},
        {width: "50px", targets: [5]},
    ],
    fnRowCallback: function (nRow, aData, iDisplayIndex) {
        $(nRow).find('td:eq(5) button').attr('data-index', iDisplayIndex);
    }
});

$(document).ready(async function () {
    await loadDataCustomer();
    // await loadDataConfigApp();
});

async function loadDataConfigApp(dataList) {
    $(".loadingData").show();
    dataMap = new Map(dataList.map(configApp => [configApp.id, configApp]));
    const config_app_table = $('#config-app-table').DataTable();
    config_app_table.clear().draw(false);
    for (let data of dataList) {
        addRowConfigApp(data, config_app_table);
    }
    $("#loadingData").hide();
}

function addRowConfigApp(data, config_app_table) {
    config_app_table.row
        .add([
            data.firebase,
            data.sheetId,
            `<img alt="image" src="assets/img/users/user-5.png" class="rounded-circle" width="50" data-toggle="tooltip" title data-original-title="Rizal Fakhri">`,
            generateDatabaseDateTime(data.lastModifiedDate),
            data.status == STATUS_CONFIG_APP_NOT_ACTIVE ? `<div class="badge badge-danger badge-shadow">Chưa sử dụng</div>` : `<div class="badge badge-success badge-shadow">Đang sử dụng</div>`,
            `<button type="button"  data-id='${data.id}' data-toggle="modal" data-target="#add-config-app-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);
}

async function loadDataCustomer() {
    const element = $("#customer");
    element.append('<option value="">--</option>');
    const dataList = await vetgoSheet.getAll(TBL_CUSTOMER);
    for (let data of dataList) {
        element.append(`<option value="${data.id}">${data.name}</option>`);
    }
}

function openModal(element) {
    const idConfig = $(element).data('id');
    const id = $("#id-config-app");
    const config_firebase = $("#config-firebase");
    const config_sheetid = $("#config-sheet-id");
    const customer = $("#customer");
    const status = $("#status");
    if (idConfig === undefined) {
        id.val("");
        config_firebase.val("");
        config_sheetid.val("");
        customer.val("");
        status.val("0");
        $("#add-config-app-modal .modal-header h5").html('Thêm Config App');
        $("#btn-add-new").show();
        $("#btn-update").hide();
        $("#btn-delete").hide();
    } else {
        $("#add-config-app-modal .modal-header h5").html('Cập nhật Config App');
        $("#btn-add-new").hide();
        $("#btn-update").show();
        $("#btn-delete").show();
        const data = dataMap.get(idConfig);
        id.val(data.id);
        config_firebase.val(data.firebase);
        config_sheetid.val(data.sheetId);
        customer.val(data.customerId);
        status.val(data.status);
    }
}

