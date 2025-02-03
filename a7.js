const GET_URL_1 = "https://R1132103036354-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const GET_URL_2 = "/expand";

const PATCH_URL_1 = "https://R1132103036354-eu1-space.3dexperience.3ds.com/enovia/resources/v1/modeler/dseng/dseng:EngItem/";
const PATCH_URL_2 = "?$mask=dskern:Mask.Default&$fields=dsmveno:CustomerAttributes&$mva=true";


var responseData = "", cestamp, objectID;
var tezgahData = [
    { "value": "860", "text": "860" },
    { "value": "1020", "text": "1020" },
    { "value": "1300", "text": "1300" },
    { "value": "CME", "text": "CME" },
    { "value": "1700", "text": "1700" },
    { "value": "V2000", "text": "V2000" },
    { "value": "LAGUN", "text": "LAGUN" },
    { "value": "KRAFT", "text": "KRAFT" },
    { "value": "FPT", "text": "FPT" },
    { "value": "TORNA", "text": "TORNA" },
    { "value": "UNIVERSAL FREZE", "text": "UNIVERSAL FREZE" },
];

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
                        $("#idEIN").text(obj.data.items[0].objectId);
                        $("#idDesc").text(obj.data.items[0].displayType);
                        $("#idName").text(obj.data.items[0].displayName);
                        objectID = obj.data.items[0].objectId;
                        myWidget.wafDataPatchFunction(objectID);
                    },
                    enter: function () {
                        dropElement.className = "drop-area-enter";
                    },
                    leave: function () {
                        dropElement.className = "drop-area-leave";
                    },
                    over: function () {
                        dropElement.className = "drop-area-over";
                    }
                });
                $('#saveAllData').click(function () {
                    myWidget.wafDataPatchFunction(objectID);
                });
                $('#operasyonSil').click(function () {
                    myWidget.operasyonSil();
                });
            },
            wafDataGetFunction: function (id) {
                cestamp = "";
                var headerWAF = {
                    "SecurityContext": "VPLMProjectLeader.Company Name.Common Space"
                };
                var url = GET_URL_1 + id + GET_URL_2;
                WAFData.authenticatedRequest(url, {
                    type: "text",
                    method: "POST",
                    headers: headerWAF,
                    onComplete: function (res) {
                        responseData = JSON.parse(res);
                    },
                    onFailure: function (error) {
                        myWidget.set_status("İŞLEM BAŞARISIZ");
                        console.log("onFailure : " + error);
                    }
                });
            },
            wafDataPatchFunction: function (objectID) {
                var tmpStr = {
                    "expandDepth": 1,
                    "withPath": true,
                    "type_filter_bo": [
                      "VPMReference",
                      "VPMRepReference"
                    ],
                    "type_filter_rel": [
                      "VPMInstance",
                      "VPMRepInstance"
                    ]
                  };

                const getCSRFTokenUrl = "https://R1132103036354-eu1-space.3dexperience.3ds.com/enovia" + "/resources/v1/application/CSRF";
                var csrfValue = "";
                WAFData.authenticatedRequest(getCSRFTokenUrl, {
                    method: "GET",
                    type: "json",
                    onComplete: function (enoCSRFTokenResponse) {
                        const enoCSRFToken = enoCSRFTokenResponse.csrf.value;
                        csrfValue = enoCSRFToken;
                        var headerWAF = {
                            "SecurityContext": "VPLMProjectLeader.Company Name.Common Space",
                            "ENO_CSRF_TOKEN": csrfValue,
                            "Content-Type": "application/json"
                        };
                        var url = GET_URL_1 + objectID + GET_URL_2;
                        WAFData.authenticatedRequest(url, {
                            method: "POST",
                            type: "json",
                            headers: headerWAF,
                            data: JSON.stringify(tmpStr),
                            onComplete: function (res) {
                                console.log(res);
                            },
                            onFailure: function (error) {
                                console.log("onFailure : " + error);
                            }
                        });
                    }
                });

            }
        };
        widget.addEvent("onLoad", myWidget.onLoadWidget);
    });
}
