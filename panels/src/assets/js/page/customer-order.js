"use strict";
var dataCustomerMap, dataPartnerMap, dataProductMap, dataProductOrderMap;
$(document).ready(async function () {
    $('.partner').addClass('active');
    $("#order-list-table").dataTable({
        order: [[5, 'desc']],
        responsive: true,
        scrollX: false,
        columnDefs: [
            {sortable: false, targets: [7]}
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).find('td:eq(7)').addClass('text-center');
            $(nRow).find('td:eq(7) button').attr('data-index', iDisplayIndex);
        }
    });
    await init();
    $("#product-order").change(function () {
        if ($(this).val() === '') {
            $("#choose-package").hide();
        } else {
            $("#choose-package").show();
            packageViewData(dataProductMap.get($(this).val()));
        }
        $("#total-price-package").html('0');
    });
    $("#phone-customer").on({
        keyup: function() {
            searchCustomerByPhone(replaceInputToNumber($(this).val()));
        },
        blur: function() {
            searchCustomerByPhone(replaceInputToNumber($(this).val()));
        }
    });
    $('.save-data').on("click", async function () {
        const idCustomer = $("#id-customer").val().trim();
        const name = $("#name-customer").val().trim();
        const phone = $("#phone-customer").val().trim();
        const email = $("#mail-customer").val().trim();
        const address = $("#address-customer").val().trim();
        const idOrder = $("#id-order").val().trim();
        const idProductOrder = $("#product-order").val().trim();
        let codeOrder = $("#code-order").val().trim();
        const idPackage = $('input[name="package"]:checked').val();
        const indexRow = parseInt($("#index-row").val());
        let isError = false;
        if (codeOrder == null || codeOrder === '') {
            codeOrder = autoIncreaseCode(VG_CODE_ORDER);
        }
        if (name == null || name === '') {
            alertIziToastError('Tên khách hàng', 'Không được để trống');
            isError = true;
        }
        if (phone == null || phone === '') {
            alertIziToastError('Số điện thoại', 'Không được để trống');
            isError = true;
        } else {
            if (!isValidPhoneNumber(phone)) {
                alertIziToastError('Số điện thoại', 'Không được hợp lệ');
                isError = true;
            }
        }
        if (email == null || email === '') {
            alertIziToastError('Địa chỉ mail', 'Không được để trống');
            isError = true;
        } else {
            if (!isValidEmail(email)) {
                alertIziToastError('Địa chỉ email', 'Không được hợp lệ');
                isError = true;
            }
        }
        if (idProductOrder == null || idProductOrder === '') {
            alertIziToastError('Sản phẩm', 'Không được để trống');
            isError = true;
        }
        if (idPackage == null || idPackage === '') {
            alertIziToastError('Gói sản phẩm', 'Không được để trống');
            isError = true;
        }
        if (isError) return;
        const isAddNewCustomer = idCustomer == null || false || idCustomer === "";
        const isAddNewOrder = idOrder == null || false || idOrder === "";
        $(this).addClass('disabled btn-progress');
        try {
            let dataCustomer;
            if (!isAddNewCustomer) dataCustomer = await vetgoSheet.getById(idCustomer, TBL_CUSTOMER);
            if (dataCustomer == null) dataCustomer = {id: null};
            dataCustomer.name = name;
            dataCustomer.phone = replaceInputToNumber(phone);
            dataCustomer.email = email;
            dataCustomer.address = address;
            const resultCustomer = await vetgoSheet.add(dataCustomer, TBL_CUSTOMER);
            dataCustomerMap.set(resultCustomer.id, resultCustomer);
            let dataOrder;
            if (!isAddNewOrder) dataOrder = await vetgoSheet.getById(idOrder, TBL_VG_ORDER);
            if (dataOrder == null) dataOrder = {id: null};
            dataOrder.code = codeOrder;
            dataOrder.id_partner = null;
            dataOrder.id_customer = resultCustomer.id;
            dataOrder.paid = STATUS_ORDER_NOT_PAID;
            dataOrder.id_package = idPackage;
            let product = dataProductMap.get(idProductOrder);
            dataOrder.attributes = JSON.stringify(product);
            dataOrder.type = null;
            dataOrder.lastUpdated = new Date().toISOString();
            const resultOrder = await vetgoSheet.add(dataOrder, TBL_VG_ORDER);

            $("#register-modal").modal("hide");
            const table = $('#order-list-table').DataTable();
            if (!isAddNewOrder) {
                table.row(`:eq(${indexRow})`).remove().draw(false);
            }
            addRowTable(resultOrder, table);
            dataProductOrderMap.set(resultOrder.id, resultOrder);
            alertIziToastSuccess("Đơn hàng", "lưu thành công");
        } catch (error) {
            console.error(error);
            alertIziToastError("Đơn hàng", "lưu thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
    $('#btn-delete-modal').on("click", async function () {
        const idDelete = $("#id-order").val();
        const indexRow = parseInt($("#index-row").val());
        $(this).addClass('disabled btn-progress');
        try {
            await vetgoSheet.deleteById(idDelete, TBL_VG_ORDER);
            dataProductOrderMap.delete(idDelete);
            $("#register-modal").modal("hide");
            const partnerListTable = $('#order-list-table').DataTable();
            partnerListTable.row(`:eq(${indexRow})`).remove().draw(false);
            alertIziToastSuccess("Đơn hàng", "xóa thành công");
        } catch (error) {
            console.error(error);
            alertIziToastSuccess("Đơn hàng", "xóa thất bại, kiểm tra lại kết nối");
        }
        $(this).removeClass('disabled btn-progress');
    });
});

async function init() {
    const customerList = (await vetgoSheet.getAll(TBL_CUSTOMER)).filter(data => data.deleted === "false");
    dataCustomerMap = new Map(customerList.map(customer => [customer.id, customer]));
    const productList = (await vetgoSheet.getAll(TBL_PRODUCT)).filter(data => data.deleted === "false");
    dataProductMap = new Map(productList.map(product => [product.id, product]));
    const productOrderList = (await vetgoSheet.getAll(TBL_VG_ORDER)).filter(data => data.deleted === "false");
    dataProductOrderMap = new Map(productOrderList.map(productOrder => [productOrder.id, productOrder]));
    const table = $('#order-list-table').DataTable();
    for (let i = 0; i < productOrderList.length; i++) {
        addRowTable(productOrderList[i], table);
    }
    loadDataProduct(productList);
    loadDataSuccess();
    $("#choose-package").hide();
}
function loadDataSuccess() {
    $("#loadingData").hide();
    $('button[data-target="#register-modal"]').removeAttr('disabled');
}
function loadDataProduct(productList) {
    let selectProductOrder = $("#product-order");
    selectProductOrder.append('<option value="">--</option>');
    for (let product of productList) {
        selectProductOrder.append(`<option value="${product.id}">${product.name}</option>`);
    }
}
function addRowTable(data, table) {
    let customer = dataCustomerMap.get(data.id_customer);
    console.log(dataCustomerMap);
    let product = JSON.parse(data.attributes);
    let packages = (JSON.parse(product.attributes)).filter(p => p.id === data.id_package)[0];
    const productInfo = `<div class="align-center"><span>${product.name}</span><br><span>${packages.packageName}: </span><span>${formatNumber(packages.packagePrice)} VNĐ</span></div>`
    const paid = data.paid === STATUS_ORDER_NOT_PAID ? `<div class="package-view badge badge-primary">Chưa thanh toán</div>` : `<div class="package-view badge badge-success">Đã thanh toán</div>`
    table.row
        .add([
            data.code,
            customer.name,
            formatPhone(customer.phone),
            customer.email,
            productInfo,
            generateDatabaseDateTime(data.lastUpdated),
            paid,
            `<button title="Chỉnh sửa" type="button" data-id='${data.id}' data-toggle="modal" data-target="#register-modal" class="btn btn-success note-btn" onclick="openModal(this);"><i class="fas fa-edit"></i></button>
             <button title="Tạo mới đơn hàng" type="button" data-id-customer='${customer.id}' data-toggle="modal" data-target="#register-modal" class="btn btn-primary note-btn" onclick="openModal(this);"><i class="fas fa-mars-double"></i></button>`
        ])
        .draw(false);
}

function openModal(element) {
    const idOpen = $(element).data('id');
    const isAddNew = $(element).data('id-customer');
    $("#index-row").val($(element).data('index'));
    const idCustomer = $("#id-customer");
    const idOrder = $("#id-order");
    const idProductOrder = $("#product-order");
    const idPackage = $('input[name="package"]');
    const idPartner = $("#id-partner");
    const name = $("#name-customer");
    const phone = $("#phone-customer");
    const email = $("#mail-customer");
    const address = $("#address-customer");
    const codeOrder = $("#code-order");
    if (idOpen === undefined) {
        if (isAddNew) {
            const dataCustomer = dataCustomerMap.get(isAddNew);
            idCustomer.val(dataCustomer.id);
            name.val(dataCustomer.name);
            phone.val(formatPhone(dataCustomer.phone));
            email.val(dataCustomer.email);
            address.val(dataCustomer.address);
        } else {
            idCustomer.val("");
            name.val("");
            phone.val("");
            email.val("");
            address.val("");
        }
        idPartner.val("");
        idOrder.val("");
        idProductOrder.val("");
        idPackage.val("");
        codeOrder.val(autoIncreaseCode(VG_CODE_ORDER));
        $("#register-modal .modal-header h2").html('Thêm đơn hàng');
        $("#btn-add-new-modal").show();
        $("#btn-update-modal").hide();
        $("#btn-delete-modal").hide();
        $("#choose-package").hide();
    } else {
        const data = dataProductOrderMap.get(idOpen);
        const dataCustomer = dataCustomerMap.get(data.id_customer);
        const product = JSON.parse(data.attributes);
        idOrder.val(data.id);
        idPartner.val(data.id_partner);
        idProductOrder.val(product.id);
        codeOrder.val(data.code);
        idCustomer.val(data.id_customer);
        name.val(dataCustomer.name);
        phone.val(formatPhone(dataCustomer.phone));
        email.val(dataCustomer.email);
        address.val(dataCustomer.address);
        packageViewData(product, data.id_package);
        $("#choose-package").show();
        $("#register-modal .modal-header h2").html('Cập nhật đơn hàng');
        $("#btn-add-new-modal").hide();
        $("#btn-update-modal").show();
        $("#btn-delete-modal").show();
    }
}
function packageViewData(product, idCheck) {
    const packageContent = $(".content-package");
    packageContent.html('');
    let contentPackage = '';
    if (product) {
        const packageList = JSON.parse(product.attributes);
        for (let packageData of packageList) {
            if (idCheck && idCheck === packageData.id) {
                contentPackage += `<div class="pretty p-icon p-curve p-rotate">
                                    <input type="radio" name="package" checked value="${packageData.id}" onchange="changePricePackage(this, '${product.id}')">
                                    <div class="state p-success-o">
                                        <i class="icon material-icons">done</i>
                                        <label> ${packageData.packageName}</label>
                                    </div>
                               </div>`;
            } else {
                contentPackage += `<div class="pretty p-icon p-curve p-rotate">
                                    <input type="radio" name="package" value="${packageData.id}" onchange="changePricePackage(this, '${product.id}')">
                                    <div class="state p-success-o">
                                        <i class="icon material-icons">done</i>
                                        <label> ${packageData.packageName}</label>
                                    </div>
                               </div>`;
            }
        }
    }
    packageContent.append(contentPackage);
}
function changePricePackage(element, idProduct) {
    const totalPrice = $("#total-price-package");
    const product = dataProductMap.get(idProduct);
    if (product) {
        const packageList = JSON.parse(product.attributes);
        for (let packageData of packageList) {
            if (packageData.id === $(element).val()) {
                totalPrice.html(formatNumber(packageData.packagePrice));
                break;
            }
        }
    }
}
function searchCustomerByPhone(value) {
    const customer = findElementByPropertyValue(dataCustomerMap, "phone", value);
    const idCustomer = $("#id-customer");
    console.log(customer);
    const name = $("#name-customer");
    const phone = $("#phone-customer");
    const email = $("#mail-customer");
    const address = $("#address-customer");
    if (customer) {
        idCustomer.val(customer.id);
        name.val(customer.name);
        phone.val(formatPhone(customer.phone));
        email.val(customer.email);
        address.val(customer.address);
    } else {
        idCustomer.val('');
    }
}
function findElementByPropertyValue(map, propertyName, targetValue) {
    for (const [key, value] of map) {
        if (value[propertyName] === targetValue) {
            return value;
        }
    }
    return null; // Trả về null nếu không tìm thấy
}

