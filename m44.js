var product_id;
function executeWidgetCode() {
    require(["DS/WAFData/WAFData", "DS/DataDragAndDrop/DataDragAndDrop"], function (WAFData, DataDragAndDrop) {
        var myWidget = {
            set_status: function (message) {
                $(".c-widget-drop-area").html(message);
            },
            onLoadWidget: function () {
                var dropElement = document.getElementById("drop_area");
                DataDragAndDrop.droppable(dropElement, {
                    drop: function (data) {
                        var obj = JSON.parse(data);
                        product_id = obj.data.items[0].objectId;
                        myWidget.clearFunction();
                        myWidget.getProductTreeFunction(product_id);
                    }
                });
                $('#clearButton').click(function () {
                    myWidget.clearFunction();
                });
                $('#saveButton').click(function () {
                    if (product_id == "") {
                        myWidget.set_status("LÜTFEN DATA SEÇİNİZ");
                    } else {
                        myWidget.saveFunction(product_id);
                    }
                });
            },
            clearFunction: function () {
                $(".table tbody").html("");
                productList = [];
                myWidget.set_status("PARÇAYI BU ALANA BIRAKIN");
            },
            getProductTreeFunction: function (product_id) {
                $.ajax({
                    url: base_url + "/engineering-item/" + product_id,
                    type: "GET",
                    contentType: "application/json",
                    success: function (response) {
                        myWidget.set_status("VERİ OKUMA İŞLEMİ BAŞARILI");
                        console.log(response);
                        var tableBody = $('#table-body');
                        myWidget.generateTable(response, tableBody);
                    },
                    error: function (xhr, status, error) {
                        console.error("Hata:", xhr.responseJSON || error);
                        myWidget.set_status("BİR HATA OLUŞTU, TEKRAR DENEYİNİZ.");
                    }
                });
            },
            generateTable: function (data, tableBody, level = 0) {
                var row = $('<tr></tr>');
                row.append(`<td>${data.Name}</td>`);
                row.append(`<td>${data.Level}</td>`);
                row.append(`<td>${data.Description}</td>`);
                row.append(`<td>${data.UrunKodu}</td>`);
                row.append(`<td>${data.UrunAdi}</td>`);
                row.append(`<td>${data.UreticiStokKodu}</td>`);
                row.append(`<td>${data.UreticiStokAdi}</td>`);
                row.append(`<td>${data.Miktar}</td>`);
                row.append(`<td>${data.Birim}</td>`);
                tableBody.append(row);

                if (data.SubStructure && data.SubStructure.length > 0) {
                    data.SubStructure.forEach(item => {
                        // var nestedTable = $('<table class="nested-table"></table>');
                        // var nestedTableBody = $('<tbody></tbody>');
                        // nestedTable.append(nestedTableBody);
                        // myWidget.generateTable(item, nestedTableBody, level + 1);
                        myWidget.generateTable(item, tableBody, level + 1);
                        // row.append($('<td></td>').append(nestedTable));
                    });
                }
            },
            saveFunction: function (product_id) {
                $.ajax({
                    url: base_url + "/send-erp-engitem/" + product_id,
                    type: "GET",
                    contentType: "application/json",
                    success: function (response) {
                        if(response.status == "ERROR"){
                            myWidget.set_status(response.err_msg);
                        }else{
                            myWidget.set_status("ERP'YE GÖNDERME İŞLEMİ BAŞARILI.");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Hata:", xhr.responseJSON || error);
                        myWidget.set_status("BİR HATA OLUŞTU, TEKRAR DENEYİNİZ.");
                    }
                });
            }
        };
        widget.addEvent("onLoad", myWidget.onLoadWidget);
    });
}
