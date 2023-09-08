"use strict";
var dataPartnerMap, dataDistributorMap;
$(document).ready(async function () {
    $('.partner-list').addClass('active');
    $('.partner-list a').addClass('toggled');
    $("#partner-list-table").dataTable({
        order: [[6, 'desc']],
        columnDefs: [
            {sortable: false, targets: [0, 7]},
            {width: "40px", targets: [0]},
            {width: "200px", targets: [1]},
            {width: "200px", targets: [2]},
            {width: "120px", targets: [3]},
            {width: "200px", targets: [4]},
            {width: "400px", targets: [5]},
            {width: "150px", targets: [6]},
            {width: "60px", targets: [7]}
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(0)').html(iDisplayIndex + 1);
            $(nRow).find('td:eq(7)').addClass('text-center');
            $(nRow).find('td:eq(7) button').attr('data-index', iDisplayIndex);
        }
    });
    await init();
    $('.save-data').on("click", async function () {
        const idPartner = $("#id-partner").val().trim();
        const idDistributor = $("#id-distributor").val().trim();
        const name = $("#name-partner").val().trim();
        const phone = $("#phone-partner").val().trim();
        const email = $("#mail-partner").val().trim();
        const address = $("#address-partner").val().trim();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (idDistributor === '') {
            alertIziToastError('Nhà phân phối', 'Không được để trống');
            isError = true;
        }
        if (name === '') {
            alertIziToastError('Tên', 'Không được để trống');
            isError = true;
        }
        if (phone === '') {
            alertIziToastError('Số điện thoại', 'Không được để trống');
            isError = true;
        } else {
            if (!isValidPhoneNumber(phone)) {
                alertIziToastError('Số điện thoại', 'Không được hợp lệ');
                isError = true;
            }
        }
        if (email !== "" && !isValidEmail(email)) {
            alertIziToastError('Địa chỉ email', 'Không được hợp lệ');
            isError = true;
        }
        if (isError) return;
        const isAddNew = idPartner == null || false || idPartner === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoSheet.getById(idPartner, TBL_PARTNER);
            if (data == null) data = {id: null};
            data.idDistributor = idDistributor;
            data.name = name;
            data.phone = replaceInputToNumber(phone);
            data.email = email;
            data.address = address;
            data.lastUpdated = new Date().toISOString();
            const result = await vetgoSheet.add(data, TBL_PARTNER);
            $("#register-modal").modal("hide");
            const partnerListTable = $('#partner-list-table').DataTable();
            if (!isAddNew) {
                partnerListTable.row(`:eq(${indexRow})`).remove().draw(false);
            }
            addRowTable(result, partnerListTable);
            dataPartnerMap.set(result.id, result);
            alertIziToastSuccess("Cộng tác viên", "lưu thành công");
        } catch (error) {
            console.error(error);
            alertIziToastError("Cộng tác viên", "lưu thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-modal').on("click", async function () {
        const idDelete = $("#id-partner").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_PARTNER);
            dataPartnerMap.delete(idDelete);
            $("#register-modal").modal("hide");
            const partnerListTable = $('#partner-list-table').DataTable();
            partnerListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess("Cộng tác viên", "xóa thành công");
        } catch (error) {
            console.error(error);
            alertIziToastSuccess("Cộng tác viên", "xóa thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function init() {
    const dataPartnerList = (await vetgoSheet.getAll(TBL_PARTNER)).filter(data => data.deleted === "false");
    dataPartnerMap = new Map(dataPartnerList.map(agent => [agent.id, agent]));
    const dataDistributorList = (await vetgoSheet.getAll(TBL_DISTRIBUTOR)).filter(data => data.deleted === "false");
    dataDistributorMap = new Map(dataDistributorList.map(distributor => [distributor.id, distributor]));
    const table = $('#partner-list-table').DataTable();
    for (let i = 0; i < dataPartnerList.length; i++) {
        addRowTable(dataPartnerList[i], table);
    }
    loadDataDistributor(dataDistributorList);
    loadDataSuccess();
}
function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#register-modal"]').removeAttr('disabled');
}
function loadDataDistributor(dataDistributorList) {
    let selectDistributor = $("#id-distributor");
    selectDistributor.append('<option value="">--</option>');
    for (let distributor of dataDistributorList) {
        selectDistributor.append(`<option value="${distributor.id}">${distributor.name}</option>`);
    }
}
function addRowTable(data, table) {
    let distributor = dataDistributorMap.get(data.idDistributor);
    table.row
        .add([
            ``,
            distributor ? distributor.name : "",
            data.name,
            formatPhone(data.phone),
            data.email,
            data.address,
            generateDatabaseDateTime(data.lastUpdated),
            `<button type="button" data-id='${data.id}' data-toggle="modal" data-target="#register-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);
}

function openModal(element) {
    const idOpen = $(element).data('id');
    $("#index-row").val($(element).data('index'));
    const idPartner = $("#id-partner");
    const idDistributor = $("#id-distributor");
    const name = $("#name-partner");
    const phone = $("#phone-partner");
    const email = $("#mail-partner");
    const address = $("#address-partner");
    if (idOpen === undefined) {
        idPartner.val("");
        idDistributor.val("");
        name.val("");
        phone.val("");
        email.val("");
        address.val("");
        $("#register-modal .modal-header h2").html('Thêm cộng tác viên');
        $("#btn-add-new-modal").show();
        $("#btn-update-modal").hide();
        $("#btn-delete-modal").hide();
    } else {
        $("#register-modal .modal-header h2").html('Cập nhật cộng tác viên');
        $("#btn-add-new-modal").hide();
        $("#btn-update-modal").show();
        $("#btn-delete-modal").show();
        const data = dataPartnerMap.get(idOpen);
        idPartner.val(data.id);
        idDistributor.val(data.idDistributor);
        name.val(data.name);
        phone.val(formatPhone(data.phone));
        email.val(data.email);
        address.val(data.address);
    }
}

