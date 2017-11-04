var newPurchase = false;
function reset() {
    $("#txtTotal").val('');
    $("#txtChange").val('');
    $("#txtItemID").val('');
    $("#txtMessage").val('');
    $("#btnPurchase").prop("disabled", true);
    $("#btnReturn").prop("disabled", true);
}
//====== Add Money =========
$("#btnDollar, #btnQuater, #btnDime, #btnNickel").click(function () {
    if (newPurchase == true) {
        newPurchase = false;
        reset();
    } else {
        $("#btnReturn").prop("disabled", false);
    }
    AddMoney($(this).data("amount"));
});

function AddMoney(amount) {
    var total = 0;
    if ($("#txtTotal").val() != "") {
        total = parseFloat($("#txtTotal").val().replace('$', ''))*100.0;
    }
    total = ((total + amount) / 100.0).toFixed(2)
    $("#txtTotal").val("$ " + total);
}
//----- End Add Money -------

//===== Change ==============
$("#btnReturn").click(function () {
    reset();
});
//----- End Change ----------

//===== Select Item =========
$(document).ready(function () {
    reset();
    $.ajax({
        url: 'http://localhost:8080/items',
        type: 'GET',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                var str, value;
                
                value = "<b><h4><p style='text-align:left'>" + item.id + "</p></h4></b>";
                value += "<h4><p>" + item.name + "</p></h4>";
                value += "<b><p>$" + item.price + "</p></b><br />";
                value += "<h4><p>Quantity Left: " + item.quantity + "</p></h4>";
                str = '<div class="col-xs-4"><div class="server-action-menu" id="divButton" onclick = "onClickDiv(' + item.id + ');" style="margin" >';
                str += value
                str += '</div></div>';

                $("#divItem").append(str);
            //alert('abc');
            });            
        },
        error: function (xhr, status, errorThrown) {
            alert(xhr.responseText);
        }
    });
});


function onClickDiv(id) {
    $("#txtItemID").val(id);
    $("#txtChange").val('');
    $("#btnPurchase").prop("disabled", false);
    $("#btnChange").prop("disabled", false);
}

function onClickItem(id) {
    $("#txtItemID").val(id);
    $("#txtChange").val('');
    $("#btnPurchase").prop("disabled", false);
    $("#btnChange").prop("disabled", false);
}
//----- End Select ----------

//===== Purchase ============
$("#btnPurchase").click(function () {
    if ($("#txtItemID").val() == '') {
        $("#txtMessage").val('Select Item.')
        return;
    }

    var total = 0;
    if ($("#txtTotal").val() != "") {
        total = parseFloat($("#txtTotal").val().replace('$', ''));
    }

    $.ajax({
        url: 'http://localhost:8080/money/' + total + '/item/' + $("#txtItemID").val(),
        type: 'GET',
        success: function (change) {
            updateChange(change);
            $("#txtMessage").val('Thank you!!!');
            $("#txtItemID").val('');
            $("#txtTotal").val('');
            $("#btnPurchase").prop("disabled", true);
            $("#btnReturn").prop("disabled", true);
            newPurchase = true;

        },
        error: function (error) {
            updateError(error);
        }
    });
});

function updateChange(change) {
    var message = '';
    if (change.quarters > 1) {
        message += change.quarters + ' quaters'
    } else if (change.quarters == 1) {
        message += change.quarters + ' quater'
    }

    if (change.dimes > 1) {
        message += ' ' + change.dimes + ' dimes'
    } else if (change.dimes == 1) {
        message += ' ' + change.dimes + ' dime'
    }

    if (change.nickels > 1) {
        message += ' ' + change.nickels + ' nickels'
    } else if (change.nickels == 1) {
        message += ' ' + change.nickels + ' nickel'
    }

    if (change.pennies > 1) {
        message += ' ' + change.pennies + ' pennies'
    } else if (change.pennies == 1) {
        message += ' ' + change.pennies + ' penny'
    }

    $("#txtChange").val(message);
}

function updateError(error) {
    $("#txtMessage").val(error.responseJSON.message);
}
//----- End Purchase --------

