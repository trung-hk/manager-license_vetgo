"use strict";
var dataAgentMap;
$(document).ready(async function () {
    $('.agent-list').addClass('active');
    $('.agent-list a').addClass('toggled');
    $("#agent-list-table").dataTable({
        order: [[6, 'desc']],
        columnDefs: [
            {sortable: false, targets: [0, 8]},
            {width: "40px", targets: [0]},
            {width: "100px", targets: [1]},
            {width: "200px", targets: [2]},
            {width: "120px", targets: [3]},
            {width: "200px", targets: [4]},
            {width: "400px", targets: [5]},
            {width: "150px", targets: [6]},
            {width: "100px", targets: [7]},
            {width: "60px", targets: [8]}
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(0)').html(iDisplayIndex + 1);
            $(nRow).find('td:eq(8)').addClass('text-center');
            $(nRow).find('td:eq(8) button').attr('data-index', iDisplayIndex);
        }
    });
    await init();
    $('.save-agent').on("click", async function () {
        const idAgent = $("#id-agent").val().trim();
        const codeAgent = $("#code-agent").val().trim();
        const nameAgent = $("#name-agent").val().trim();
        const phone = $("#phone-agent").val().trim();
        const email = $("#mail-agent").val().trim();
        const address = $("#address-agent").val().trim();
        const status = $("#status-agent").val().trim();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (codeAgent === '') {
            alertIziToastError('Mã đại lý', 'Không được để trống');
            isError = true;
        }
        if (nameAgent === '') {
            alertIziToastError('Tên đại lý', 'Không được để trống');
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
        if (!isValidEmail(email)) {
            alertIziToastError('Địa chỉ email', 'Không được hợp lệ');
            isError = true;
        }
        if (isError) return;
        const isAddNew = idAgent == null || false || idAgent === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoSheet.getById(idAgent, TBL_AGENT);
            if (data == null) data = {id: null};
            data.code = codeAgent;
            data.name = nameAgent;
            data.phone = replaceInputToNumber(phone);
            data.email = email;
            data.address = address;
            data.status = status;
            data.lastUpdated = new Date().toISOString();
            const result = await vetgoSheet.add(data, TBL_AGENT);
            $("#register-modal").modal("hide");
            const agentListTable = $('#agent-list-table').DataTable();
            if (!isAddNew) {
                console.log(agentListTable.row(`:eq(${indexRow})`).data());
                agentListTable.row(`:eq(${indexRow})`).remove().draw(false);
            }
            addRowTable(result, agentListTable);
            dataAgentMap.set(result.id, result);
            alertIziToastSuccess("Đại lý", "lưu thành công");
        } catch (error) {
            console.error(error);
            alertIziToastError("Đại lý", "lưu thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-agent').on("click", async function () {
        const idDelete = $("#id-agent").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_AGENT);
            dataAgentMap.delete(idDelete);
            $("#register-modal").modal("hide");
            const agentListTable = $('#agent-list-table').DataTable();
            agentListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess("Đại lý", "xóa thành công");
        } catch (error) {
            console.error(error);
            alertIziToastSuccess("Đại lý", "xóa thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function init() {
    const dataAgentList = (await vetgoSheet.getAll(TBL_AGENT)).filter(data => data.deleted === "false");
    dataAgentMap = new Map(dataAgentList.map(agent => [agent.id, agent]));
    const table = $('#agent-list-table').DataTable();
    for (let i = 0; i < dataAgentList.length; i++) {
        addRowTable(dataAgentList[i], table);
    }
    loadDataSuccess();
}
function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#register-modal"]').removeAttr('disabled');
}
function addRowTable(data, table) {
    let labelStatus;
    switch (data.status) {
        case "0":
            labelStatus = `<div class="status-package-view badge badge-success badge-shadow">Đang hoạt động</div>`;
            break;
        case "1":
            labelStatus = `<div class="status-package-view badge badge-danger badge-shadow">Ngừng hoạt động</div>`;
            break;
    }
    table.row
        .add([
            ``,
            data.code,
            data.name,
            formatPhone(data.phone),
            data.email,
            data.address,
            generateDatabaseDateTime(data.lastUpdated),
            labelStatus,
            `<button type="button" data-id='${data.id}' data-toggle="modal" data-target="#register-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);
}

function openModal(element) {
    const idOpen = $(element).data('id');
    $("#index-row").val($(element).data('index'));
    const idAgent = $("#id-agent");
    const codeAgent = $("#code-agent");
    const nameAgent = $("#name-agent");
    const phone = $("#phone-agent");
    const email = $("#mail-agent");
    const address = $("#address-agent");
    const status = $("#status-agent");
    if (idOpen === undefined) {
        idAgent.val("");
        codeAgent.val("");
        nameAgent.val("");
        phone.val("");
        email.val("");
        address.val("");
        status.val("0");
        $("#register-modal .modal-header h2").html('Thêm đại lý');
        $("#btn-add-new-agent").show();
        $("#btn-update-agent").hide();
        $("#btn-delete-agent").hide();
    } else {
        $("#register-modal .modal-header h2").html('Cập nhật đại lý');
        $("#btn-add-new-agent").hide();
        $("#btn-update-agent").show();
        $("#btn-delete-agent").show();
        const data = dataAgentMap.get(idOpen);
        idAgent.val(data.id);
        codeAgent.val(data.code);
        nameAgent.val(data.name);
        phone.val(formatPhone(data.phone));
        email.val(data.email);
        address.val(data.address);
        status.val(data.status);
    }
}

