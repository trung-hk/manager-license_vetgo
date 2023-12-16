"use strict";
var dataAgentMap, dataProductMap, dataAgentProductMap;
$(document).ready(async function () {
    $('.agent-product').addClass('active');
    $('.agent-product a').addClass('toggled');
    $("#agent-product-table").dataTable({
        order: [[4, 'desc']],
        columnDefs: [
            {sortable: false, targets: [0, 5]},
            {width: "40px", targets: [0]},
            {width: "200px", targets: [1]},
            {width: "200px", targets: [2]},
            {width: "200px", targets: [3]},
            {width: "150px", targets: [4]},
            {width: "60px", targets: [5]}
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(0)').html(iDisplayIndex + 1);
            $(nRow).find('td:eq(0)').addClass('text-center');
            $(nRow).find('td:eq(5)').addClass('text-center');
            $(nRow).find('td:eq(5) button').attr('data-index', iDisplayIndex);
        }
    });
    await init();
    $('.save-data').on("click", async function () {
        const idProductRegister = $("#id-product-register").val().trim();
        const idAgent = $("#agent-register").val().trim();
        const idProduct = $("#product-register").val().trim();
        const indexRow = parseInt($("#index-row").val());
        console.log(idAgent, idProduct);
        let isError = false;
        if (idAgent === '') {
            alertIziToastError('Đại lý đăng ký', 'Không được để trống');
            isError = true;
        }
        if (idProduct === '') {
            alertIziToastError('Sản phẩm đăng ký', 'Không được để trống');
            isError = true;
        }
        if (isError) return;
        const isAddNew = idProductRegister == null || false || idProductRegister === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoSheet.getById(idProductRegister, TBL_AGENT_PRODUCT);
            if (data == null) data = {id: null};
            data.idAgent = idAgent;
            data.idProduct = idProduct;
            data.lastUpdated = new Date().toISOString();
            const result = await vetgoSheet.add(data, TBL_AGENT_PRODUCT);
            $("#register-modal").modal("hide");
            const agentProductTable = $('#agent-product-table').DataTable();
            if (!isAddNew) {
                agentProductTable.row(`:eq(${indexRow})`).remove().draw(false);
            }
            addRowTable(result, agentProductTable);
            dataAgentProductMap.set(result.id, result);
            alertIziToastSuccess("Đăng ký sản phẩm", "thành công");
        } catch (error) {
            console.error(error);
            alertIziToastError("Đăng ký sản phẩm", "thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-modal').on("click", async function () {
        const idDelete = $("#id-product-register").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_AGENT_PRODUCT);
            dataAgentProductMap.delete(idDelete);
            $("#register-modal").modal("hide");
            const agentProductListTable = $('#agent-product-table').DataTable();
            agentProductListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess("Sản phẩm đăng ký", "xóa thành công");
        } catch (error) {
            console.error(error);
            alertIziToastSuccess("Sản phẩm đăng ký", "xóa thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $("#product-register").change(function () {
        loadPackageView($(this).val());
    });
});

async function init() {
    const dataAgentList = (await vetgoSheet.getAll(TBL_AGENT)).filter(data => data.deleted === "false");
    dataAgentMap = new Map(dataAgentList.map(agent => [agent.id, agent]));
    const dataProductList = (await vetgoSheet.getAll(TBL_PRODUCT)).filter(data => data.deleted === "false");
    dataProductMap = new Map(dataProductList.map(product => [product.id, product]));
    const dataAgentProductList = (await vetgoSheet.getAll(TBL_AGENT_PRODUCT)).filter(data => data.deleted === "false");
    dataAgentProductMap = new Map(dataAgentProductList.map(ap => [ap.id, ap]));
    const table = $('#agent-product-table').DataTable();
    for (let i = 0; i < dataAgentProductList.length; i++) {
        addRowTable(dataAgentProductList[i], table);
    }
    loadDataAgent(dataAgentList);
    loadDataProduct(dataProductList);
    loadDataSuccess();
}

function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#register-modal"]').removeAttr('disabled');
}

function loadDataAgent(dataAgentList) {
    let selectAgent = $("#agent-register");
    selectAgent.append('<option value="">--</option>');
    for (let agent of dataAgentList) {
        selectAgent.append(`<option value="${agent.id}">${agent.name}</option>`);
    }
}

function loadDataProduct(dataProductList) {
    let selectProduct = $("#product-register");
    selectProduct.append('<option value="">--</option>');
    for (let product of dataProductList) {
        selectProduct.append(`<option value="${product.id}">${product.name}</option>`);
    }
}

function addRowTable(data, table) {
    let packageView = ``;
    let dataPackageList = JSON.parse(dataProductMap.get(data.idProduct).attributes);
    if (dataPackageList != null && dataPackageList.length > 0) {
        for (let dataPackage of dataPackageList) {
            packageView += `<div class="package-view badge badge-success">${dataPackage.packageName}: ${formatNumber(dataPackage.packagePrice)} VNĐ</div><br>`
        }
    } else packageView = '<div class="package-view badge badge-primary">Chưa đăng ký gói</div>';
    table.row
        .add([
            ``,
            dataAgentMap.get(data.idAgent).name,
            dataProductMap.get(data.idProduct).name,
            packageView,
            generateDatabaseDateTime(data.lastUpdated),
            `<button type="button" data-id='${data.id}' data-toggle="modal" data-target="#register-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);
}

function openModal(element) {
    const idOpen = $(element).data('id');
    $("#index-row").val($(element).data('index'));
    const idProductRegister = $("#id-product-register");
    const idAgent = $("#agent-register");
    const idProduct = $("#product-register");
    if (idOpen === undefined) {
        idProductRegister.val("");
        idAgent.val("");
        idProduct.val("");
        $("#register-modal .modal-header h2").html('Đăng ký sản phẩm');
        $("#btn-add-new-modal").show();
        $("#btn-update-modal").hide();
        $("#btn-delete-modal").hide();
        loadPackageView();
    } else {
        $("#register-modal .modal-header h2").html('Cập nhật sản phẩm');
        $("#btn-add-new-modal").hide();
        $("#btn-update-modal").show();
        $("#btn-delete-modal").show();
        const data = dataAgentProductMap.get(idOpen);
        idProductRegister.val(data.id);
        idAgent.val(data.idAgent);
        idProduct.val(data.idProduct);
        loadPackageView(data.idProduct);
    }
}

function loadPackageView(idProduct) {
    let contentPackage = $("#content-package");
    contentPackage.html("");
    const dataProduct = dataProductMap.get(idProduct);
    if (dataProduct) {
        const dataPackageList = JSON.parse(dataProduct.attributes);
        for (let i = 0; i < dataPackageList.length; i++) {
            contentPackage.append($("#template-view-package").html());
            contentPackage.find(`.name-package:eq(${i})`).val(dataPackageList[i].packageName);
            contentPackage.find(`.price-package:eq(${i})`).val(formatNumber(dataPackageList[i].packagePrice));
        }
    }
    viewEmptyPackageDiv();
}

function viewEmptyPackageDiv() {
    const divEmptyPackage = $(".empty-package-product");
    if ($("#content-package").children().length > 0) {
        divEmptyPackage.hide();
    } else {
        divEmptyPackage.show();
    }
}

