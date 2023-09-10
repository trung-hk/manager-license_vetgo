"use strict";
var dataMap;
$( document ).ready(async function() {
    $('.manager-config-app').addClass('active');
    $('.manager-config-app a').addClass('toggled');
    $("#config-app-table").dataTable({
        order: [[3, 'desc']],
        columnDefs: [
            { sortable: false, targets: [0, 1, 2, 5] },
            { width: "480px", targets: [0, 1] },
            { width: "70px", targets: [2] },
            { width: "105px", targets: [3] },
            { width: "70px", targets: [4] },
            { width: "50px", targets: [5] },
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(5) button').attr('data-index', iDisplayIndex);
        }
    });

    await loadDataCustomer();
    await loadDataConfigApp();
    $('.save-config-app').on("click", async function() {
        let config_id = $("#id-config-app").val().trim();
        let config_firebase = $("#config-firebase").val().trim();
        let config_sheetid = $("#config-sheet-id").val().trim();
        let customer = $("#customer").val().trim();
        let status = $("#status").val().trim();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (config_firebase === '') {
            alertIziToastError('Config firebase', 'không được để trống');
            isError = true;
        }
        if (config_sheetid === '') {
            alertIziToastError('Config sheetId', 'không được để trống');
            isError = true;
        }
        if (isError) return;
        const isAddNew = config_id == null || false || config_id === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoDB.getById(config_id, API_CONFIG_APP);
            if (data == null) data = {id: null};
            data.firebase = config_firebase;
            data.sheetId = config_sheetid;
            data.status = status;
            data.customerId = customer;
            const result = isAddNew ? await vetgoDB.add(data, API_CONFIG_APP) : await vetgoDB.update(data, API_CONFIG_APP);
            $("#add-config-app-modal").modal("hide");
            const config_app_table = $('#config-app-table').DataTable();
            if (!isAddNew) config_app_table.row(`:eq(${indexRow})`).remove().draw(false);
            addRowConfigApp(result, config_app_table);
            dataMap.set(result.id, result);
            alertIziToastSuccess('Config App', 'Lưu thành công');
        } catch (error) {
            console.error(error);
            alertIziToastSuccess('Config App', 'Lưu thất bại');
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-config').on("click", async function() {
        const idDelete = $("#id-config-app").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoDB.deleteById(idDelete, API_CONFIG_APP);
            $("#add-config-app-modal").modal("hide");
            const config_app_table = $('#config-app-table').DataTable();
            config_app_table.row(`:eq(${indexRow})`).remove().draw(false);
            dataMap.delete(idDelete);
            alertIziToastSuccess('Config App', 'Xóa thành công');
        } catch (error) {
            console.error(error);
            alertIziToastSuccess('Config App', 'Xóa thất bại');
        }

        $(this).removeClass('disabled btn-progress');
    });
});
async function loadDataConfigApp() {
    const dataList = (await vetgoDB.getAll(API_CONFIG_APP));
    dataMap = new Map(dataList.map(configApp => [configApp.id, configApp]));
    const config_app_table = $('#config-app-table').DataTable();
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
            generateDatabaseDateTime(data.lastUpdated),
            data.status === STATUS_CONFIG_APP_NOT_ACTIVE ? `<div class="badge badge-danger badge-shadow">Chưa sử dụng</div>` :`<div class="badge badge-success badge-shadow">Đang sử dụng</div>`,
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
    $("#index-row").val($(element).data('index'));
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
        $("#btn-add-new-config").show();
        $("#btn-update-config").hide();
        $("#btn-delete-config").hide();
    } else {
        $("#add-config-app-modal .modal-header h5").html('Cập nhật Config App');
        $("#btn-add-new-config").hide();
        $("#btn-update-config").show();
        $("#btn-delete-config").show();
        const data = dataMap.get(idConfig);
        id.val(data.id);
        config_firebase.val(data.firebase);
        config_sheetid.val(data.sheetId);
        customer.val(data.customerId);
        status.val(data.status);
    }
}

