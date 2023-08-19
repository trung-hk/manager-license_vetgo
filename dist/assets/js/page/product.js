"use strict";
$('.product').addClass('active');
$('.product .menu-toggle').addClass('toggled');
$( document ).ready(async function() {
    $(".card-header").hide()
    $(".card-body").hide();
    var categoryList = await vetgoSheet.getAll(TBL_CATEGORIES);
    await loadGroupCategory(categoryList);
    await loadCategoryMenu(categoryList);
    $(".loader-data").hide();
    $(".card-header").show()
    $(".card-body").show();
    $('.sub-menu ul').hide();
    $('.add-category').on("click", async function() {
        let nameCategory = $("#name-category").val();
        let groupCategory = $("#group-category").val();
        if (nameCategory === '') {
            $(".invalid-feedback").show();
            $(".invalid-feedback").html("Hãy nhập tên danh mục");
            return;
        }
        $(this).addClass('disabled btn-progress');
        const categoryList1 = await vetgoSheet.getAll(TBL_CATEGORIES);
        let category = null;
        if (groupCategory !== '') {
            category = categoryList1.filter(c => c.categoryParentId == groupCategory && c.categoryName === nameCategory)[0];
        } else {
            category = categoryList1.filter(c => c.categoryName === nameCategory)[0];
        }
        if (category && category != undefined) {
            $(".invalid-feedback").show();
            $(".invalid-feedback").html(`Tên danh mục ${nameCategory} đã tồn tại`);
            $(this).removeClass('disabled btn-progress');
            return;
        }
        const dataInsert = {
            id: null,
            categoryName: nameCategory,
            categoryParentId: groupCategory
        }
        await vetgoSheet.add(dataInsert, TBL_CATEGORIES);
        var categoryListNew = await vetgoSheet.getAll(TBL_CATEGORIES);
         loadGroupCategory(categoryListNew);
         loadCategoryMenu(categoryListNew);
        $(this).removeClass('disabled btn-progress');
        $("#add-category-modal").modal('hide');
        $('.sub-menu ul').hide();
    });
    async function loadGroupCategory(categoryList) {
        const categoryGroupNameMap = getGroupNameCategory(categoryList);
        const element = $("#group-category");
        element.html("");
        element.append('<option value="">--</option>');
        for (let category of categoryList) {
            let name = categoryGroupNameMap.get(category.id).groupName;
            if (name == null) name = category.categoryName
            element.append(`<option value="${category.id}">${name}</option>`);
        }
    }
    function getGroupNameCategory(categoryList) {
        const result = new Map();
        for (let category of categoryList) {
            let groupName = category.categoryName;
            let parentId = category.categoryParentId;
            let hasChild = false;
            while (parentId !== "") {
                let parentCategory = categoryList.filter(pc => pc.id === parentId)[0];
                groupName = parentCategory.categoryName + " > " + groupName;
                parentId = parentCategory.categoryParentId;
                hasChild = true;
            }
            result.set(category.id, {groupName: hasChild ? groupName : null, hasChild: hasChild});
        }
        return result;
    }
});
function showDropDownMenu(element) {
    $(element).parent(".sub-menu").children("ul").slideToggle();
    $(element).toggleClass("fa-minus fa-plus");
}
function activeViewProduct(element) {
    $("#category-nav li").removeClass("active");
    $(element).parent("li").toggleClass("active");
}
async function loadCategoryMenu(categoryList) {
    const element = $("#category-nav");
    element.html("");
    var textElement = '<ul>';
    textElement += '<li class="active"><a class="m-l-20" href="#All" onclick = "activeViewProduct(this);">Tất cả</a></li>';
    let parentCategoryList = categoryList.filter(c => c.categoryParentId == null || c.categoryParentId === "");
    for (var category of parentCategoryList) {
        var childCategory = categoryList.filter(c => c.categoryParentId === category.id);
        if (childCategory.length === 0) {
            textElement += `<li><a class="m-l-20" href="#" onclick = "activeViewProduct(this);">${category.categoryName}</a></li>`;
        } else {
            textElement += `<li class='sub-menu'><i class='fas fa-plus right m-r-10' onclick = "showDropDownMenu(this);"></i><a href='#' onclick = "activeViewProduct(this);">${category.categoryName}</a>`
            textElement = createCategoryMenu(categoryList, childCategory, textElement);
            textElement += '</li>';
        }
    }
    textElement += '</ul>';
    element.append(textElement);
}
function createCategoryMenu(categoryList, childCategoryList, textElement) {
    textElement += '<ul>';
    for (var category of childCategoryList) {
        var childCategory = categoryList.filter(c => c.categoryParentId === category.id);
        if (childCategory.length === 0) {
            textElement += `<li><a class="m-l-20" href="#" onclick ="activeViewProduct(this);">${category.categoryName}</a></li>`;
        } else {
            textElement += `<li class='sub-menu'><i class='fas fa-plus right m-r-10' onclick = "showDropDownMenu(this);"></i><a href='#' onclick = "activeViewProduct(this);">${category.categoryName}</a>`
            textElement = createCategoryMenu(categoryList, childCategory, textElement);
            textElement += '</li>';
        }
    }
    textElement += '</ul>';
    return textElement;
}

