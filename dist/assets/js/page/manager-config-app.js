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
        ]
    });

    await loadDataCustomer();
    dataMap = await loadDataConfigApp();
    console.log(dataMap);
    $('.save-config-app').on("click", async function() {
        let config_id = $("#id-config-app").val().trim();
        let config_firebase = $("#config-firebase").val().trim();
        let config_sheetid = $("#config-sheet-id").val().trim();
        let customer = $("#customer").val().trim();
        let status = $("#status").val().trim();
        let isError = false;
        if (config_firebase === '') {
            iziToast.error({
                title: 'Config firebase',
                message: 'không được để trống',
                position: 'topRight'
            });
            isError = true;
        }
        if (config_sheetid === '') {
            iziToast.error({
                title: 'Config sheetId',
                message: 'không được để trống',
                position: 'topRight'
            });
            isError = true;
        }
        if (isError) return;
        const isAddNew = config_id == null || false || config_id === "";
        $(this).addClass('disabled btn-progress');
        let data = await vetgoSheet.getById(config_id, TBL_CONFIG_APP);
        if (data == null) data = {id: null};
        data.firebase = config_firebase;
        data.sheet_id = config_sheetid;
        data.status = status;
        data.id_customer = customer;
        data.lastUpdated = new Date().toISOString();
        const result = await vetgoSheet.add(data, TBL_CONFIG_APP);
        if (result) {
            iziToast.success({
                title: 'Config App',
                message: isAddNew ?'thêm mới thành công' : 'Cập nhật thành công',
                position: 'topRight'
            });
            $("#add-config-app-modal").modal("hide");
            const config_app_table = $('#config-app-table').DataTable();
            if (isAddNew) {
                addRowConfigApp(result, config_app_table, dataMap);
            } else {
                config_app_table.clear().draw();
                $("#loadingData").show();
                dataMap = await loadDataConfigApp();
            }
        } else {
            iziToast.error({
                title: 'Config App',
                message: isAddNew ?'thêm mới thất bại' : 'Cập nhật thất bại',
                position: 'topRight'
            });
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-config').on("click", async function() {
        const idConfig = $(this).data('id');
        $(this).addClass('disabled btn-progress');
        const result = await vetgoSheet.deleteById(idConfig, TBL_CONFIG_APP);
        if (result) {
            iziToast.success({
                title: 'Config App',
                message: 'Xóa thành công',
                position: 'topRight'
            });
            $("#add-config-app-modal").modal("hide");
            const config_app_table = $('#config-app-table').DataTable();
            config_app_table.clear().draw();
            $("#loadingData").show();
            dataMap = await loadDataConfigApp();
        } else {
            iziToast.error({
                title: 'Config App',
                message: 'Xóa thất bại',
                position: 'topRight'
            });
        }
        $(this).removeClass('disabled btn-progress');
    });
});
async function loadDataConfigApp() {
    let dataMap = new Map();
    const dataList = (await vetgoSheet.getAll(TBL_CONFIG_APP)).filter(data => data.deleted === "false");
    const config_app_table = $('#config-app-table').DataTable();
    // let count = 1;
    for (let data of dataList) {
        addRowConfigApp(data, config_app_table, dataMap);
        // count++;
    }
    $("#loadingData").hide();
    return dataMap;
}
function addRowConfigApp(data, config_app_table, dataMap) {
    config_app_table.row
        .add([
            data.firebase,
            data.sheet_id,
            `<img alt="image" src="assets/img/users/user-5.png" class="rounded-circle" width="50" data-toggle="tooltip" title data-original-title="Rizal Fakhri">`,
            generateDatabaseDateTime(data.lastUpdated),
            data.status == "0" ? `<div class="badge badge-danger badge-shadow">Chưa sử dụng</div>` :`<div class="badge badge-success badge-shadow">Đang sử dụng</div>`,
            `<button type="button"  data-id='${data.id}' data-toggle="modal" data-target="#add-config-app-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);
    dataMap.set(data.id, data);
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
        $("#btn-add-new-config").show();
        $("#btn-update-config").hide();
        $("#btn-delete-config").hide();
    } else {
        $("#add-config-app-modal .modal-header h5").html('Cập nhật Config App');
        $("#btn-add-new-config").hide();
        $("#btn-update-config").show();
        $("#btn-delete-config").show();
        $("#btn-delete-config").attr("data-id", idConfig);
        const data = dataMap.get(idConfig);
        id.val(data.id);
        config_firebase.val(data.firebase);
        config_sheetid.val(data.sheet_id);
        customer.val(data.id_customer);
        status.val(data.status);
    }
}

