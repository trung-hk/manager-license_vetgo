"use strict";
$( document ).ready(async function() {
    $('.categories').addClass('active');
    $(".card-header").hide()
    $(".card-body").hide();
    const categoryList = await vetgoSheet.getAll(TBL_CATEGORIES);
    const categoryGroupNameMap = getGroupNameCategory();
    await loadGroupCategory();
    await loadData();
    $(".loader-data").hide();
    $(".card-header").show()
    $(".card-body").show();
    // $(".section").removeClass("loader");
    // $(".section").show();
    $('.add-category').on("click", async function() {
        let nameCategory = $("#name-category").val();
        let groupCategory = $("#group-category").val();
        if (nameCategory === '') {
            $(".invalid-feedback").show();
            $(".invalid-feedback").html("Hãy nhập tên danh mục");
            return;
        }
        $(this).addClass('disabled btn-progress');
        const categoryList = await vetgoSheet.getAll(TBL_CATEGORIES);
        let category = null;
        if (groupCategory !== '') {
            category = categoryList.filter(c => c.categoryParentId == groupCategory && c.categoryName === nameCategory)[0];
        } else {
            category = categoryList.filter(c => c.categoryName === nameCategory)[0];
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
        location.reload();
    });
    async function loadGroupCategory() {
        const element = $("#group-category");
        element.append('<option value="">--</option>');
        console.log((categoryList));
        for (let category of categoryList) {
            let name = categoryGroupNameMap.get(category.id).groupName;
            if (name == null) name = category.categoryName
            element.append(`<option value="${category.id}">${name}</option>`);
        }
    }
    async function loadCategoryMenu() {
        const element = $("category-nav");
        const parentCategoryList = categoryList.filter(c => c.p)
    }
    function createCategoryMenu(categoryList, element) {

    }
});




