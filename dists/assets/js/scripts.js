"use strict";
window.communication.listenChange("ScriptComponent", (dataRequest) => {
  switch (dataRequest.event) {
    case 'alert-success':
      alertIziToastSuccess(dataRequest.data.title, dataRequest.data.message);
      break;
    case 'alert-error':
      alertIziToastError(dataRequest.data.title, dataRequest.data.message);
      break;
  }
});
$(window).on("load", function () {
  $(".loader").fadeOut("slow");
});
$("#logout").click(function () {
  localStorage.clear();
  window.keycloak.logout();
})
feather.replace();
// Global
$(function () {
  let sidebar_nicescroll_opts = {
    cursoropacitymin: 0,
    cursoropacitymax: 0.8,
    zindex: 892
  },
    now_layout_class = null;

  var sidebar_sticky = function () {
    if ($("body").hasClass("layout-2")) {
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({
        parent: $("body")
      });
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({ recalc_every: 1 });
    }
  };
  sidebar_sticky();

  var sidebar_nicescroll;
  var update_sidebar_nicescroll = function () {
    let a = setInterval(function () {
      if (sidebar_nicescroll != null) sidebar_nicescroll.resize();
    }, 10);

    setTimeout(function () {
      clearInterval(a);
    }, 600);
  };

  var sidebar_dropdown = function () {
    if ($(".main-sidebar").length) {
      $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
      sidebar_nicescroll = $(".main-sidebar").getNiceScroll();

      $(".main-sidebar .sidebar-menu li a.has-dropdown")
        .off("click")
        .on("click", function () {
          var me = $(this);

          me.parent()
            .find("> .dropdown-menu")
            .slideToggle(500, function () {
              update_sidebar_nicescroll();
              return false;
            });
          return false;
        });
    }
  };
  sidebar_dropdown();

  if ($("#top-5-scroll").length) {
    $("#top-5-scroll")
      .css({
        height: 315
      })
      .niceScroll();
  }
  if ($("#scroll-new").length) {
    $("#scroll-new")
      .css({
        height: 200
      })
      .niceScroll();
  }

  $(".main-content").css({
    minHeight: $(window).outerHeight() - 95
  });

  $(".nav-collapse-toggle").click(function () {
    $(this)
      .parent()
      .find(".navbar-nav")
      .toggleClass("show");
    return false;
  });

  $(document).on("click", function (e) {
    $(".nav-collapse .navbar-nav").removeClass("show");
  });

  var toggle_sidebar_mini = function (mini) {
    let body = $("body");

    if (!mini) {
      body.removeClass("sidebar-mini");
      $(".main-sidebar").css({
        overflow: "hidden"
      });
      setTimeout(function () {
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }, 500);
      $(".main-sidebar .sidebar-menu > li > ul .dropdown-title").remove();
      $(".main-sidebar .sidebar-menu > li > a").removeAttr("data-toggle");
      $(".main-sidebar .sidebar-menu > li > a").removeAttr(
        "data-original-title"
      );
      $(".main-sidebar .sidebar-menu > li > a").removeAttr("title");
    } else {
      body.addClass("sidebar-mini");
      body.removeClass("sidebar-show");
      sidebar_nicescroll.remove();
      sidebar_nicescroll = null;
      $(".main-sidebar .sidebar-menu > li").each(function () {
        let me = $(this);

        if (me.find("> .dropdown-menu").length) {
          me.find("> .dropdown-menu").hide();
          me.find("> .dropdown-menu").prepend(
            '<li class="dropdown-title pt-3">' + me.find("> a").text() + "</li>"
          );
        } else {
          me.find("> a").attr("data-toggle", "tooltip");
          me.find("> a").attr("data-original-title", me.find("> a").text());
          $("[data-toggle='tooltip']").tooltip({
            placement: "right"
          });
        }
      });
    }
  };

  // sticky header toggle function
  var toggle_sticky_header = function (sticky) {
    if (!sticky) {
      $(".main-navbar")[0].classList.remove("sticky");
    } else {
      $(".main-navbar")[0].classList += " sticky";
    }
  };

  $('.menu-toggle').on('click', function (e) {
    var $this = $(this);
    $this.toggleClass('toggled');

  });

  $.each($('.main-sidebar .sidebar-menu li.active'), function (i, val) {
    var $activeAnchors = $(val).find('a:eq(0)');

    $activeAnchors.addClass('toggled');
    $activeAnchors.next().show();
  });

  $("[data-toggle='sidebar']").click(function () {
    var body = $("body"),
      w = $(window);

    if (w.outerWidth() <= 1024) {
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-gone")) {
        body.removeClass("sidebar-gone");
        body.addClass("sidebar-show");
      } else {
        body.addClass("sidebar-gone");
        body.removeClass("sidebar-show");
      }

      update_sidebar_nicescroll();
    } else {
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-mini")) {
        toggle_sidebar_mini(false);
      } else {
        toggle_sidebar_mini(true);
      }
    }

    return false;
  });

  var toggleLayout = function () {
    var w = $(window),
      layout_class = $("body").attr("class") || "",
      layout_classes =
        layout_class.trim().length > 0 ? layout_class.split(" ") : "";

    if (layout_classes.length > 0) {
      layout_classes.forEach(function (item) {
        if (item.indexOf("layout-") != -1) {
          now_layout_class = item;
        }
      });
    }

    if (w.outerWidth() <= 1024) {
      if ($("body").hasClass("sidebar-mini")) {
        toggle_sidebar_mini(false);
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }

      $("body").addClass("sidebar-gone");
      $("body").removeClass("layout-2 layout-3 sidebar-mini sidebar-show");
      $("body")
        .off("click")
        .on("click", function (e) {
          if (
            $(e.target).hasClass("sidebar-show") ||
            $(e.target).hasClass("search-show")
          ) {
            $("body").removeClass("sidebar-show");
            $("body").addClass("sidebar-gone");
            $("body").removeClass("search-show");

            update_sidebar_nicescroll();
          }
        });

      update_sidebar_nicescroll();

      if (now_layout_class == "layout-3") {
        let nav_second_classes = $(".navbar-secondary").attr("class"),
          nav_second = $(".navbar-secondary");

        nav_second.attr("data-nav-classes", nav_second_classes);
        nav_second.removeAttr("class");
        nav_second.addClass("main-sidebar");

        let main_sidebar = $(".main-sidebar");
        main_sidebar
          .find(".container")
          .addClass("sidebar-wrapper")
          .removeClass("container");
        main_sidebar
          .find(".navbar-nav")
          .addClass("sidebar-menu")
          .removeClass("navbar-nav");
        main_sidebar.find(".sidebar-menu .nav-item.dropdown.show a").click();
        main_sidebar.find(".sidebar-brand").remove();
        main_sidebar.find(".sidebar-menu").before(
          $("<div>", {
            class: "sidebar-brand"
          }).append(
            $("<a>", {
              href: $(".navbar-brand").attr("href")
            }).html($(".navbar-brand").html())
          )
        );
        setTimeout(function () {
          sidebar_nicescroll = main_sidebar.niceScroll(sidebar_nicescroll_opts);
          sidebar_nicescroll = main_sidebar.getNiceScroll();
        }, 700);

        sidebar_dropdown();
        $(".main-wrapper").removeClass("container");
      }
    } else {
      $("body").removeClass("sidebar-gone sidebar-show");
      if (now_layout_class) $("body").addClass(now_layout_class);

      let nav_second_classes = $(".main-sidebar").attr("data-nav-classes"),
        nav_second = $(".main-sidebar");

      if (
        now_layout_class == "layout-3" &&
        nav_second.hasClass("main-sidebar")
      ) {
        nav_second.find(".sidebar-menu li a.has-dropdown").off("click");
        nav_second.find(".sidebar-brand").remove();
        nav_second.removeAttr("class");
        nav_second.addClass(nav_second_classes);

        let main_sidebar = $(".navbar-secondary");
        main_sidebar
          .find(".sidebar-wrapper")
          .addClass("container")
          .removeClass("sidebar-wrapper");
        main_sidebar
          .find(".sidebar-menu")
          .addClass("navbar-nav")
          .removeClass("sidebar-menu");
        main_sidebar.find(".dropdown-menu").hide();
        main_sidebar.removeAttr("style");
        main_sidebar.removeAttr("tabindex");
        main_sidebar.removeAttr("data-nav-classes");
        $(".main-wrapper").addClass("container");
        // if(sidebar_nicescroll != null)
        //   sidebar_nicescroll.remove();
      } else if (now_layout_class == "layout-2") {
        $("body").addClass("layout-2");
      } else {
        update_sidebar_nicescroll();
      }
    }
  };
  toggleLayout();
  $(window).resize(toggleLayout);

  $("[data-toggle='search']").click(function () {
    var body = $("body");

    if (body.hasClass("search-gone")) {
      body.addClass("search-gone");
      body.removeClass("search-show");
    } else {
      body.removeClass("search-gone");
      body.addClass("search-show");
    }
  });

  // tooltip
  $("[data-toggle='tooltip']").tooltip();

  // popover
  $('[data-toggle="popover"]').popover({
    container: "body"
  });

  // Select2
  if (jQuery().select2) {
    $(".select2").select2();
  }

  // Selectric
  if (jQuery().selectric) {
    $(".selectric").selectric({
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  $(".notification-toggle").dropdown();
  $(".notification-toggle")
    .parent()
    .on("shown.bs.dropdown", function () {
      $(".dropdown-list-icons").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7
      });
    });

  $(".message-toggle").dropdown();
  $(".message-toggle")
    .parent()
    .on("shown.bs.dropdown", function () {
      $(".dropdown-list-message").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7
      });
    });

  if (jQuery().summernote) {
    $(".summernote").summernote({
      dialogsInBody: true,
      minHeight: 250
    });
    $(".summernote-simple").summernote({
      dialogsInBody: true,
      minHeight: 150,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["font", ["strikethrough"]],
        ["para", ["paragraph"]]
      ]
    });
  }

  // Dismiss function
  $("[data-dismiss]").each(function () {
    var me = $(this),
      target = me.data("dismiss");

    me.click(function () {
      $(target).fadeOut(function () {
        $(target).remove();
      });
      return false;
    });
  });

  // Collapsable
  $("[data-collapse]").each(function () {
    var me = $(this),
      target = me.data("collapse");

    me.click(function () {
      $(target).collapse("toggle");
      $(target).on("shown.bs.collapse", function () {
        me.html('<i class="fas fa-minus"></i>');
      });
      $(target).on("hidden.bs.collapse", function () {
        me.html('<i class="fas fa-plus"></i>');
      });
      return false;
    });
  });

  // Background
  $("[data-background]").each(function () {
    var me = $(this);
    me.css({
      backgroundImage: "url(" + me.data("background") + ")"
    });
  });

  // Custom Tab
  $("[data-tab]").each(function () {
    var me = $(this);

    me.click(function () {
      if (!me.hasClass("active")) {
        var tab_group = $('[data-tab-group="' + me.data("tab") + '"]'),
          tab_group_active = $(
            '[data-tab-group="' + me.data("tab") + '"].active'
          ),
          target = $(me.attr("href")),
          links = $('[data-tab="' + me.data("tab") + '"]');

        links.removeClass("active");
        me.addClass("active");
        target.addClass("active");
        tab_group_active.removeClass("active");
      }
      return false;
    });
  });

  // Bootstrap 4 Validation
  $(".needs-validation").submit(function () {
    var form = $(this);
    if (form[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.addClass("was-validated");
  });

  // alert dismissible
  $(".alert-dismissible").each(function () {
    var me = $(this);

    me.find(".close").click(function () {
      me.alert("close");
    });
  });

  if ($(".main-navbar").length) {
  }

  // Image cropper
  $("[data-crop-image]").each(function (e) {
    $(this).css({
      overflow: "hidden",
      position: "relative",
      height: $(this).data("crop-image")
    });
  });

  // Slide Toggle
  $("[data-toggle-slide]").click(function () {
    let target = $(this).data("toggle-slide");

    $(target).slideToggle();
    return false;
  });

  // Dismiss modal
  $("[data-dismiss=modal]").click(function () {
    $(this)
      .closest(".modal")
      .modal("hide");

    return false;
  });

  // Width attribute
  $("[data-width]").each(function () {
    $(this).css({
      width: $(this).data("width")
    });
  });

  // Height attribute
  $("[data-height]").each(function () {
    $(this).css({
      height: $(this).data("height")
    });
  });

  // Chocolat
  if ($(".chocolat-parent").length && jQuery().Chocolat) {
    $(".chocolat-parent").Chocolat();
  }

  // Sortable card
  if ($(".sortable-card").length && jQuery().sortable) {
    $(".sortable-card").sortable({
      handle: ".card-header",
      opacity: 0.8,
      tolerance: "pointer"
    });
  }

  // Daterangepicker
  if (jQuery().daterangepicker) {
    if ($(".datepicker").length) {
      $(".datepicker").daterangepicker({
        locale: { format: "YYYY-MM-DD" },
        singleDatePicker: true
      });
    }
    if ($(".datetimepicker").length) {
      $(".datetimepicker").daterangepicker({
        locale: { format: "YYYY-MM-DD hh:mm" },
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
      });
    }
    if ($(".daterange").length) {
      $(".daterange").daterangepicker({
        locale: { format: "YYYY-MM-DD" },
        drops: "down",
        opens: "right"
      });
    }
  }

  // Timepicker
  if (jQuery().timepicker && $(".timepicker").length) {
    $(".timepicker").timepicker({
      icons: {
        up: "fas fa-chevron-up",
        down: "fas fa-chevron-down"
      }
    });
  }

  $("#mini_sidebar_setting").on("change", function () {
    var _val = $(this).is(":checked") ? "checked" : "unchecked";
    if (_val === "checked") {
      toggle_sidebar_mini(true);
    } else {
      toggle_sidebar_mini(false);
    }
  });
  $("#sticky_header_setting").on("change", function () {
    if ($(".main-navbar")[0].classList.contains("sticky")) {
      toggle_sticky_header(false);
    } else {
      toggle_sticky_header(true);
    }
  });

  $(".theme-setting-toggle").on("click", function () {
    if ($(".theme-setting")[0].classList.contains("active")) {
      $(".theme-setting")[0].classList.remove("active");
    } else {
      $(".theme-setting")[0].classList += " active";
    }
  });

  // full screen call

  $(document).on("click", ".fullscreen-btn", function (e) {
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });

  // setting sidebar

  $(".settingPanelToggle").on("click", function () {
    $(".settingSidebar").toggleClass("showSettingPanel");
  }),
    $(".page-wrapper").on("click", function () {
      $(".settingSidebar").removeClass("showSettingPanel");
    });

  // close right sidebar when click outside
  var mouse_is_inside = false;
  $(".settingSidebar").hover(
    function () {
      mouse_is_inside = true;
    },
    function () {
      mouse_is_inside = false;
    }
  );

  $("body").mouseup(function () {
    if (!mouse_is_inside) $(".settingSidebar").removeClass("showSettingPanel");
  });

  $(".settingSidebar-body").niceScroll();

  // theme change event
  $(".choose-theme li").on("click", function () {
    var bodytag = $("body"),
      selectedTheme = $(this),
      prevTheme = $(".choose-theme li.active").attr("title");

    $(".choose-theme li").removeClass("active"),
      selectedTheme.addClass("active");
    $(".choose-theme li.active").data("theme");

    bodytag.removeClass("theme-" + prevTheme);
    bodytag.addClass("theme-" + $(this).attr("title"));
  });

  // dark light sidebar button setting
  $(".sidebar-color input:radio").change(function () {
    if ($(this).val() == "1") {
      $("body").removeClass("dark-sidebar");
      $("body").addClass("light-sidebar");
    } else {
      $("body").removeClass("light-sidebar");
      $("body").addClass("dark-sidebar");
    }
  });

  // dark light layout button setting
  $(".layout-color input:radio").change(function () {
    if ($(this).val() == "1") {
      $("body").removeClass();
      $("body").addClass("light");
      $("body").addClass("light-sidebar");
      $("body").addClass("theme-white");

      $(".choose-theme li").removeClass("active");
      $(".choose-theme li[title|='white']").addClass("active");
      $(".selectgroup-input[value|='1']").prop("checked", true);
    } else {
      $("body").removeClass();
      $("body").addClass("dark");
      $("body").addClass("dark-sidebar");
      $("body").addClass("theme-black");

      $(".choose-theme li").removeClass("active");
      $(".choose-theme li[title|='black']").addClass("active");
      $(".selectgroup-input[value|='2']").prop("checked", true);
    }
  });

  // restore default to dark theme
  $(".btn-restore-theme").on("click", function () {
    //remove all class from body
    $("body").removeClass();
    jQuery("body").addClass("light");
    jQuery("body").addClass("light-sidebar");
    jQuery("body").addClass("theme-white");

    // set default theme
    $(".choose-theme li").removeClass("active");
    $(".choose-theme li[title|='white']").addClass("active");

    $(".select-layout[value|='1']").prop("checked", true);
    $(".select-sidebar[value|='2']").prop("checked", true);
    toggle_sidebar_mini(false);
    $("#mini_sidebar_setting").prop("checked", false);
    $("#sticky_header_setting").prop("checked", true);
    toggle_sticky_header(true);
  });

  //start up class add

  //add default class on body tag
  jQuery("body").addClass("light");
  jQuery("body").addClass("light-sidebar");
  jQuery("body").addClass("theme-white");
  // set theme default color
  $(".choose-theme li").removeClass("active");
  $(".choose-theme li[title|='white']").addClass("active");
  //set default dark or light layout(1=light, 2=dark)
  $(".select-layout[value|='1']").prop("checked", true);
  //set default dark or light sidebar(1=light, 2=dark)
  $(".select-sidebar[value|='1']").prop("checked", true);
  // sticky header default set to true
  $("#sticky_header_setting").prop("checked", true);
});
function generateDatabaseDateTime(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày đã cho
  let date = new Date(dateString);
  // Kiểm tra xem đối tượng Date có hợp lệ hay không
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  // Lấy các thành phần thời gian để định dạng thành chuỗi YYYY-MM-DD HH:mm:ss
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');

  // Trả về chuỗi định dạng thời gian
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function inputKeyUpFormatMoney(element) {
  formatCurrency($(element));
}
function inputBlurFormatMoney(element) {
  formatCurrency($(element), "blur");
}
$("input[data-type='currency']").on({
  keyup: function() {
    formatCurrency($(this));
  },
  blur: function() {
    formatCurrency($(this), "blur");
  }
});
$("input[data-type='phone']").on({
  keyup: function() {
    formatPhoneNumber($(this));
  },
  blur: function() {
    //formatPhoneNumber($(this), "blur");
  }
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") { return; }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    // if (blur === "blur") {
    //   right_side += "00";
    // }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    // input_val = "$" + left_side + "." + right_side;
    input_val = left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    //input_val = "$" + input_val;

    // final formatting
    // if (blur === "blur") {
    //   input_val += ".00";
    // }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
function formatPhoneNumber(input, blur) {
  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") { return; }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // remove all non-digits
  input_val = replaceInputToNumber(input_val);

  // format phone number
  var formatted_number = formatPhone(input_val);
  input.value = formatted_number;

  // On blur, if necessary, add extra zeros
  if (blur === "blur") {
    formatted_number += "0000";
  }

  // send updated string to input
  input.val(formatted_number);

  // put caret back in the right position
  var updated_len = formatted_number.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
function formatPhone(value) {
  return '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
}
function replaceInputToNumber(value) {
  return value.replace(/\D/g, "");
}
function alertIziToastSuccess(title, message) {
  if (title) {
    iziToast.success({
      title: title,
      message: message,
      position: 'topRight'
    });
  } else {
    iziToast.success({
      message: message,
      position: 'topRight'})
  }

}
function alertIziToastError(title, message) {
  if (title) {
    iziToast.error({
      title: title,
      message: message,
      position: 'topRight'
    });
  } else {
    iziToast.error({
      message: message,
      position: 'topRight'})
  }
}
function isValidEmail(email) {
  // Biểu thức chính quy kiểm tra định dạng email
  var emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  // Sử dụng test() để kiểm tra email với biểu thức chính quy
  return emailRegex.test(email);
}
function isValidPhoneNumber(phoneNumber) {
  // Biểu thức chính quy kiểm tra định dạng số điện thoại
  var phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

  // Sử dụng test() để kiểm tra số điện thoại với biểu thức chính quy
  return phoneRegex.test(phoneNumber);
}

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function autoIncreaseCode(code) {
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return code + 'xxxxxxxxxx'.replace(/[x]/g, function (c) {
    var r = Math.random() * 10;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 10 | 0;
      d = Math.floor(d / 10);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 10 | 0;
      d2 = Math.floor(d2 / 10);
    }
    return r.toString(10);
  });
}
$("#sidebar-wrapper li a").click(function (){
  if (window.innerWidth < 765) {
    $("#sidebar-control").click();
  }
});