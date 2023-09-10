"use strict";
var dataProductMap;
$(document).ready(async function () {
    $('.product-service').addClass('active');
    $('.product-service a').addClass('toggled');
    $("#product-list-table").dataTable({
        order: [[4, 'desc']],
        columnDefs: [
            {sortable: false, targets: [0, 3, 6]},
            {width: "40px", targets: [0]},
            {width: "200px", targets: [1]},
            {width: "500px", targets: [2]},
            {width: "105px", targets: [3]},
            {width: "120px", targets: [4]},
            {width: "120px", targets: [5]},
            {width: "60px", targets: [6]}
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(0) input').attr('id', `checkbox-${iDisplayIndex + 1}`);
            $(nRow).find('td:eq(0) label').attr('for', `checkbox-${iDisplayIndex + 1}`);
            $(nRow).find('td:eq(6)').addClass('text-center');
            $(nRow).find('td:eq(6) button').attr('data-index', iDisplayIndex);
        }
    });
    await init();
    $("#btn-add-new-package").click(function () {
        $("#content-package").append($("#template-add-package").html());
        viewEmptyPackageDiv();
    });
    $('.save-product').on("click", async function () {
        const idProduct = $("#id-product").val().trim();
        const nameProduct = $("#name-product").val().trim();
        const descriptionProduct = $("#description-product").val().trim();
        const status = $("#status-product").val().trim();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (nameProduct === '') {
            alertIziToastError('Tên sản phẩm', 'không được để trống');
            isError = true;
        }
        if (descriptionProduct === '') {
            alertIziToastError('Mô tả sản phâm', 'không được để trống');
            isError = true;
        }
        if (isError) return;
        const isAddNew = idProduct == null || false || idProduct === "";
        $(this).addClass('disabled btn-progress');
        try {
            let data;
            if (!isAddNew) data = await vetgoSheet.getById(idProduct, TBL_PRODUCT);
            if (data == null) data = {id: null};
            data.name = nameProduct;
            data.description = descriptionProduct;
            data.idCategory = null;
            data.type = TYPE_PRODUCT_SERVICE;
            data.price = null;
            data.status = status;
            const packages = [];
            for (let element of $('#content-package .row-parent-package')) {
                let idPackage = $(element).find('.id-package').val();
                let namePackage = $(element).find('.name-package').val();
                let pricePackage = $(element).find('.price-package').val().replaceAll(",", "");
                if (idPackage == null || idPackage === '' || idPackage === undefined) idPackage = generateUUID();
                packages.push({id: idPackage,packageName: namePackage, packagePrice: pricePackage});
            }
            data.attributes = JSON.stringify(packages);
            data.lastUpdated = new Date().toISOString();
            const result = await vetgoSheet.add(data, TBL_PRODUCT);
            $("#save-product-service-modal").modal("hide");
            const productListTable = $('#product-list-table').DataTable();
            if (!isAddNew) productListTable.row(`:eq(${indexRow})`).remove().draw(false);
            addRowTable(result, productListTable);
            dataProductMap.set(result.id, result);
            alertIziToastSuccess('Sản phẩm', 'Lưu thành công');
        } catch (error) {
            console.error(error);
            alertIziToastError('Sản phẩm', 'lưu thất bại, kiểm tra lại kết nối');
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-product').on("click", async function () {
        const idDelete = $("#id-product").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_PRODUCT);
            dataProductMap.delete(idDelete);
            $("#save-product-service-modal").modal("hide");
            const productListTable = $('#product-list-table').DataTable();
            productListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess('Sản phẩm', 'xóa thành công');
        } catch (error) {
            console.error(error);
            alertIziToastSuccess('Sản phẩm', 'xóa thất bại, kiểm tra lại kết nối');
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function init() {
    const dataProductList = (await vetgoSheet.getAll(TBL_PRODUCT)).filter(data => data.deleted === "false");
    dataProductMap = new Map(dataProductList.map(product => [product.id, product]));
    const table = $('#product-list-table').DataTable();
    for (let data of dataProductList) {
        addRowTable(data, table);
    }
    loadDataStatus();
    loadDataSuccess();
}
function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#save-product-service-modal"]').removeAttr('disabled');
}
function loadDataStatus() {
    let selectStatus = $("#status-product");
    for (let status of STATUS_PRODUCT_SERVICE_LIST) {
        selectStatus.append(`<option value="${status.value}">${status.name}</option>`)
    }
}

function addRowTable(data, table) {
    let labelStatus;
    switch (data.status) {
        case STATUS_PRODUCT_SERVICE_DEVELOPED:
            labelStatus = `<div class="status-package-view badge badge-success badge-shadow">Đã phát triển</div>`;
            break;
        case STATUS_PRODUCT_SERVICE_DEVELOPING:
            labelStatus = `<div class="status-package-view badge badge-warning badge-shadow">Đang phát triển</div>`;
            break;
        case STATUS_PRODUCT_SERVICE_STOP_DEVELOP:
            labelStatus = `<div class="status-package-view badge badge-danger badge-shadow">Ngừng phát triển</div>`;
            break;
        default:
            labelStatus = `<div class="status-package-view badge badge-success badge-shadow">Đã phát triển</div>`;
            break;
    }
    let packageView = ``;
    let dataPackageList = JSON.parse(data.attributes);
    if (dataPackageList != null && dataPackageList.length > 0) {
        for (let dataPackage of dataPackageList) {
            packageView += `<div class="package-view badge badge-success">${dataPackage.packageName}: ${formatNumber(dataPackage.packagePrice)} VNĐ</div><br>`
        }
    } else packageView = '<div class="package-view badge badge-primary">Chưa đăng ký gói</div>';

    table.row
        .add([
            `<div class="text-center custom-checkbox custom-control">
                <input type="checkbox" data-checkboxes="product-group" class="custom-control-input" >
                <label class="custom-control-label">&nbsp;</label>
            </div>`,
            data.name,
            data.description,
            packageView,
            generateDatabaseDateTime(data.lastUpdated),
            labelStatus,
            `<button type="button" data-id='${data.id}' data-toggle="modal" data-target="#save-product-service-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>`
        ])
        .draw(false);

}

function openModal(element) {
    const idProductOpen = $(element).data('id');
    $("#index-row").val($(element).data('index'));
    const idProduct = $("#id-product");
    const nameProduct = $("#name-product");
    const descriptionProduct = $("#description-product");
    const status = $("#status-product");
    $("#content-package").html('');
    if (idProductOpen === undefined) {
        idProduct.val("");
        nameProduct.val("");
        descriptionProduct.val("");
        status.val(STATUS_PRODUCT_SERVICE_DEVELOPED);
        $("#save-product-service-modal .modal-header h2").html('Thêm Sản phẩm');
        $("#btn-add-new-product").show();
        $("#btn-update-product").hide();
        $("#btn-delete-product").hide();
    } else {
        $("#save-product-service-modal .modal-header h2").html('Cập nhật sản phẩm');
        $("#btn-add-new-product").hide();
        $("#btn-update-product").show();
        $("#btn-delete-product").show();
        const dataProduct = dataProductMap.get(idProductOpen);
        idProduct.val(dataProduct.id);
        nameProduct.val(dataProduct.name);
        descriptionProduct.val(dataProduct.description);
        status.val(dataProduct.status);
        const dataPackageList = JSON.parse(dataProduct.attributes);
        for (let i = 0; i < dataPackageList.length; i++) {
            $("#content-package").append($("#template-add-package").html());
            $(`#content-package .id-package:eq(${i})`).val(dataPackageList[i].id);
            $(`#content-package .name-package:eq(${i})`).val(dataPackageList[i].packageName);
            $(`#content-package .price-package:eq(${i})`).val(formatNumber(dataPackageList[i].packagePrice));
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

function removePackage(element) {
    $(element).parents('.row-parent-package').remove();
    viewEmptyPackageDiv();
}

