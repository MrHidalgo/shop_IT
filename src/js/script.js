function selectInit(selector) {
    if (selector === undefined) {
        var selector = 'select';
    }
    selectReset(selector);
    $(selector).on('change', function () {
        selectReset(this);
    });
}

function selectReset(selector){
    if (selector === undefined) {
        var selector = 'select';
    }
    $(selector).each(function(){
        var valOption = $(this).children('option:selected');
        $(this).prev('span').html(valOption.text());
    });
}

function radioInit() {
    $("div.select-item, div.radio-item").click(function(e) {
        e.preventDefault();
        $(this).parent().find("div.select-item, div.radio-item").removeClass("active");
        $(this).addClass('active');
        $(this).parent().find('input[type="radio"]:checked').prop('checked', false);
        $(this).find('input[type="radio"]').prop('checked', true).change();
    });
}

function checkboxInit() {
    $("div.insurance-item").click(function(e) {
        e.preventDefault();
        var inputCheckbox = $(this).find('input');
        if ($(this).hasClass('disabled')){
            return false;
        }
        $(this).toggleClass('active');
        if(inputCheckbox.prop('checked') == true){
            inputCheckbox.prop('checked', false).change();
        } else {
            inputCheckbox.prop('checked', true).change();
        }
        return false;
    });
}


$(document).ready( function () {
    selectInit();
    radioInit();
    checkboxInit();

    $('body').on('click', function (e) {
        if (!$(e.target).closest('.btn-cvv').length) {
            $('.btn-cvv').siblings('.info-m').removeClass('show-info');
        }
    });

    $('.btn.btn-cvv').on('click', function(e){
        e.preventDefault;

        $(this).siblings('.info-m').toggleClass('show-info');
    });


    // test
    $(".b-test").on("click", function(e){
        var _thisDataId = $(this).attr("data-id");

        $(".forms-row").removeClass("error focus");

        if (_thisDataId == "error") {
            console.log("error");
            $(".forms-row").addClass("error");
        } else if (_thisDataId == "focus") {
            console.log("focus");
            $(".forms-row").addClass("focus");
        } else {
            console.log("clear");
            $(".forms-row").removeClass("error focus");
        }

        $(".input-wrap__card-r .forms-row").removeClass("error focus");
    });
});
