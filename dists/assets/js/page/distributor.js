"use strict";
var dataAgentMap, dataDistributorMap;
$(document).ready(async function () {
    $('.distributor-list').addClass('active');
    $('.distributor-list a').addClass('toggled');
    $("#distributor-list-table").dataTable({
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
        const idDistributor = $("#id-distributor").val().trim();
        const idAgent = $("#id-agent").val().trim();
        const name = $("#name-distributor").val().trim();
        const phone = $("#phone-distributor").val().trim();
        const email = $("#mail-distributor").val().trim();
        const address = $("#address-distributor").val().trim();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (idAgent === '') {
            alertIziToastError('Đại lý', 'Không được để trống');
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
        const isAddNew = idDistributor == null || false || idDistributor === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoSheet.getById(idDistributor, TBL_DISTRIBUTOR);
            if (data == null) data = {id: null};
            data.idAgent = idAgent;
            data.name = name;
            data.phone = replaceInputToNumber(phone);
            data.email = email;
            data.address = address;
            data.lastUpdated = new Date().toISOString();
            const result = await vetgoSheet.add(data, TBL_DISTRIBUTOR);
            $("#register-modal").modal("hide");
            const distributorListTable = $('#distributor-list-table').DataTable();
            if (!isAddNew) {
                distributorListTable.row(`:eq(${indexRow})`).remove().draw(false);
            }
            addRowTable(result, distributorListTable);
            dataDistributorMap.set(result.id, result);
            alertIziToastSuccess("Nhà phân phối", "lưu thành công");
        } catch (error) {
            console.error(error);
            alertIziToastError("Nhà phân phối", "lưu thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-modal').on("click", async function () {
        const idDelete = $("#id-distributor").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_DISTRIBUTOR);
            dataDistributorMap.delete(idDelete);
            $("#register-modal").modal("hide");
            const distributorListTable = $('#distributor-list-table').DataTable();
            distributorListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess("Nhà phân phối", "xóa thành công");
        } catch (error) {
            console.error(error);
            alertIziToastSuccess("Nhà phân phối", "xóa thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function init() {
    const dataAgentList = (await vetgoSheet.getAll(TBL_AGENT)).filter(data => data.deleted === "false");
    dataAgentMap = new Map(dataAgentList.map(agent => [agent.id, agent]));
    const dataDistributorList = (await vetgoSheet.getAll(TBL_DISTRIBUTOR)).filter(data => data.deleted === "false");
    dataDistributorMap = new Map(dataDistributorList.map(distributor => [distributor.id, distributor]));
    const table = $('#distributor-list-table').DataTable();
    for (let i = 0; i < dataDistributorList.length; i++) {
        addRowTable(dataDistributorList[i], table);
    }
    loadDataAgent(dataAgentList);
    loadDataSuccess();
}
function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#register-modal"]').removeAttr('disabled');
}
function loadDataAgent(dataAgentList) {
    let selectAgent = $("#id-agent");
    selectAgent.append('<option value="">--</option>');
    for (let agent of dataAgentList) {
        selectAgent.append(`<option value="${agent.id}">${agent.name}</option>`);
    }
}
function addRowTable(data, table) {
    let agent = dataAgentMap.get(data.idAgent);
    table.row
        .add([
            ``,
            agent ? agent.name : "",
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
    const idDistributor = $("#id-distributor");
    const idAgent = $("#id-agent");
    const name = $("#name-distributor");
    const phone = $("#phone-distributor");
    const email = $("#mail-distributor");
    const address = $("#address-distributor");
    if (idOpen === undefined) {
        idDistributor.val("");
        idAgent.val("");
        name.val("");
        phone.val("");
        email.val("");
        address.val("");
        $("#register-modal .modal-header h2").html('Thêm nhà phân phối');
        $("#btn-add-new-modal").show();
        $("#btn-update-modal").hide();
        $("#btn-delete-modal").hide();
    } else {
        $("#register-modal .modal-header h2").html('Cập nhật nhà phân phối');
        $("#btn-add-new-modal").hide();
        $("#btn-update-modal").show();
        $("#btn-delete-modal").show();
        const data = dataDistributorMap.get(idOpen);
        idDistributor.val(data.id);
        idAgent.val(data.idAgent);
        name.val(data.name);
        phone.val(formatPhone(data.phone));
        email.val(data.email);
        address.val(data.address);
    }
}

