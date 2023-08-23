"use strict";
var dataProductMap;
var dataPackageMap;
$(document).ready(async function () {
    $('.product-service').addClass('active');
    $('.product-service a').addClass('toggled');
    $("#product-list-table").dataTable({
        order: [[4, 'desc']],
        columnDefs: [
            { sortable: false, targets: [0, 3, 6] },
            { width: "40px", targets: [0] },
            { width: "200px", targets: [0] },
            { width: "500px", targets: [2] },
            { width: "105px", targets: [3] },
            { width: "120px", targets: [4] },
            { width: "120px", targets: [5] },
            { width: "60px", targets: [6] }
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(0) input').attr('id', `checkbox-${iDisplayIndex + 1}`);
            $(nRow).find('td:eq(0) label').attr('for', `checkbox-${iDisplayIndex + 1}`);
            $(nRow).find('td:eq(6)').addClass('text-center');
            $(nRow).find('td:eq(6) button').attr('data-index', iDisplayIndex);
        }
    });
    await loadDataProduct();
    $("#btn-add-new-package").click(function () {
        $("#content-package").append($("#template-add-package").html());
        viewEmptyPackageDiv();
    });
    $('.save-product').on("click", async function () {
        const idProduct = $("#id-product").val().trim();
        const nameProduct = $("#name-product").val().trim();
        const descriptionProduct = $("#description-product").val().trim();
        const status = $("#status-product").val().trim();
        const indexRow = parseInt($(this).data('index'));
        let isError = false;
        if (nameProduct === '') {
            iziToast.error({
                title: 'Tên sản phẩm',
                message: 'không được để trống',
                position: 'topRight'
            });
            isError = true;
        }
        if (descriptionProduct === '') {
            iziToast.error({
                title: 'Mô tả sản phâm ',
                message: 'không được để trống',
                position: 'topRight'
            });
            isError = true;
        }
        if (isError) return;
        const isAddNew = idProduct == null || false || idProduct === "";
        $(this).addClass('disabled btn-progress');
        let data;
        if (!isAddNew) data = await vetgoSheet.getById(idProduct, TBL_PRODUCT);
        if (data == null) data = {id: null};
        data.name = nameProduct;
        data.description = descriptionProduct;
        data.type = TYPE_PRODUCT_SERVICE;
        data.status = status;
        data.lastUpdated = new Date().toISOString();

        try {
            const result = await vetgoSheet.add(data, TBL_PRODUCT);
            const packageMap = isAddNew ?
                new Map() :
                new Map((await vetgoSheet.getAll(TBL_PACKAGE_PRODUCT)).filter(pp => pp.idProduct === result.id && pp.deleted === "false").map(p => [p.id, p]));
            let updatePackageList = [];
            for (let element of $('#content-package .row-parent-package')) {
                let idPackage = $(element).find('.id-package').val().trim();
                let namePackage = $(element).find('.name-package').val();
                let pricePackage = $(element).find('.price-package').val().replaceAll(",", "");

                let packageProduct;
                if (idPackage != null && idPackage !== '') {
                    packageProduct = packageMap.get(idPackage);
                    packageMap.delete(idPackage);
                }
                if (packageProduct == null) packageProduct = {id: null};
                packageProduct.idProduct = result.id;
                packageProduct.name = namePackage;
                packageProduct.price = pricePackage;
                updatePackageList.push(packageProduct);
            }
            if (updatePackageList.length > 0) updatePackageList = await vetgoSheet.addAll(updatePackageList, TBL_PACKAGE_PRODUCT);
            if (!isAddNew) {
                for (let idDelete of packageMap.keys()) {
                    await vetgoSheet.deleteById(idDelete, TBL_PACKAGE_PRODUCT)
                }

            }
            iziToast.success({
                title: 'Sản phẩm',
                message: isAddNew ? 'thêm mới thành công' : 'Cập nhật thành công',
                position: 'topRight'
            });
            $("#save-product-service-modal").modal("hide");
            const productListTable = $('#product-list-table').DataTable();
            if (!isAddNew) productListTable.row(`:eq(${indexRow})`).remove().draw(false);
            addRowTable(result, updatePackageList, productListTable);
            dataProductMap.set(result.id, result);
            dataPackageMap.set(result.id, updatePackageList);
        } catch (error) {
            console.error(error);
            iziToast.error({
                title: 'Sản phẩm',
                message: 'lưu thất bại, kiểm tra lại kết nối',
                position: 'topRight'
            });
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-product').on("click", async function() {
        const idProduct = $(this).data('id');
        const indexRow = parseInt($(this).data('index'));
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idProduct, TBL_PRODUCT);
            for (let dataPackage of dataPackageMap.get(idProduct)) {
                await vetgoSheet.deleteById(dataPackage.id, TBL_PACKAGE_PRODUCT);
            }
            dataProductMap.delete(idProduct);
            dataPackageMap.delete(idProduct);
            iziToast.success({
                title: 'Sản phẩm',
                message: 'xóa thành công',
                position: 'topRight'
            });
            $("#save-product-service-modal").modal("hide");
            const productListTable = $('#product-list-table').DataTable();
            productListTable.row(`:eq(${indexRow})`).remove().draw(false);
        } catch (error) {
            console.error(error);
            iziToast.error({
                title: 'Sản phẩm',
                message: 'Xóa thất bại, kiểm tra lại kết nối',
                position: 'topRight'
            });
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function loadDataProduct() {
    const dataProductList = (await vetgoSheet.getAll(TBL_PRODUCT)).filter(data => data.deleted === "false");
    dataProductMap = new Map(dataProductList.map(product => [product.id, product]));
    const dataPackageList = (await vetgoSheet.getAll(TBL_PACKAGE_PRODUCT)).filter(data => data.deleted === "false");
    dataPackageMap = new Map(dataProductList.map(product => [product.id, dataPackageList.filter(pac => pac.idProduct === product.id)]));
    const table = $('#product-list-table').DataTable();
    for (let i = 0; i < dataProductList.length; i++) {
        addRowTable(dataProductList[i], dataPackageMap.get(dataProductList[i].id), table);
    }
    $("#loadingData").hide();
}

function addRowTable(data, dataPackageList, table) {
    let labelStatus;
    switch (data.status) {
        case "0": labelStatus = `<div class="status-package-view badge badge-success badge-shadow">Đã phát triển</div>`; break;
        case "1": labelStatus = `<div class="status-package-view badge badge-warning badge-shadow">Đang phát triển</div>`; break;
        case "2": labelStatus = `<div class="status-package-view badge badge-danger badge-shadow">Ngừng phát triển</div>`; break;
        default: labelStatus = `<div class="status-package-view badge badge-success badge-shadow">Đã phát triển</div>`; break;
    }
    let packageView = ``;
    if (dataPackageList != null && dataPackageList.length > 0) {
        for (let dataPackage of dataPackageList) {
            packageView += `<div class="package-view badge badge-success">${dataPackage.name}: ${formatNumber(dataPackage.price)} VNĐ</div><br>`
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

async function loadDataCustomer() {
    const element = $("#customer");
    element.append('<option value="">--</option>');
    const dataList = await vetgoSheet.getAll(TBL_CUSTOMER);
    for (let data of dataList) {
        element.append(`<option value="${data.id}">${data.name}</option>`);
    }
}

function openModal(element) {
    const idProductOpen = $(element).data('id');
    const indexRow = $(element).data('index');
    const idProduct = $("#id-product");
    const nameProduct = $("#name-product");
    const descriptionProduct = $("#description-product");
    const status = $("#status-product");
    $("#content-package").html('');
    if (idProductOpen === undefined) {
        idProduct.val("");
        nameProduct.val("");
        descriptionProduct.val("");
        status.val("0");
        $("#save-product-service-modal .modal-header h2").html('Thêm Sản phẩm');
        $("#btn-add-new-product").show();
        $("#btn-update-product").hide();
        $("#btn-delete-product").hide();
    } else {
        $("#save-product-service-modal .modal-header h2").html('Cập nhật sản phẩm');
        $("#btn-add-new-product").hide();
        $("#btn-update-product").show();
        $("#btn-update-product").attr("data-index", indexRow);
        $("#btn-delete-product").show();
        $("#btn-delete-product").attr("data-id", idProductOpen);
        $("#btn-delete-product").attr("data-index", indexRow);
        const dataProduct = dataProductMap.get(idProductOpen);
        idProduct.val(dataProduct.id);
        nameProduct.val(dataProduct.name);
        descriptionProduct.val(dataProduct.description);
        status.val(dataProduct.status);
        const dataPackageList = dataPackageMap.get(idProductOpen);
        for (let i = 0; i < dataPackageList.length; i++) {
            $("#content-package").append($("#template-add-package").html());
            $(`#content-package .id-package:eq(${i})`).val(dataPackageList[i].id);
            $(`#content-package .name-package:eq(${i})`).val(dataPackageList[i].name);
            $(`#content-package .price-package:eq(${i})`).val(formatNumber(dataPackageList[i].price));
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

