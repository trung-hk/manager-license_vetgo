"use strict";
$('.add-product-list').addClass('active');
$('.add-product-list a').addClass('toggled');
const message = sessionStorage.getItem("message-info");
const updateFlag = sessionStorage.getItem("update-flag");
if (message) {
    sessionStorage.removeItem("message-info");
    sessionStorage.removeItem("update-flag");
    $(".messageInfo").show();
    $(".messageInfo").html(message);
    $(".messageInfo").addClass(updateFlag != null  ? "alert-success" : "alert-danger");
}
$('#btn-submit').on("click", async function() {
    let codeProduct = $("#code-product").val();
    let nameProduct = $("#name-product").val();
    let description = $("#description-product").val();
    if (codeProduct === '' || nameProduct === ``) {
        return;
    }
    const dataInsert = {
        id: codeProduct,
        name: nameProduct,
        description: description
    }
    $(this).addClass('btn disabled btn-progress');
    const result = await vetgoSheet.add(dataInsert, TBL_PRODUCT);
    sessionStorage.setItem("message-info", result ? "Thêm sản thành công" : "Thêm sản thất bại");
    sessionStorage.setItem("update-flag", result);
    location.reload();
});
