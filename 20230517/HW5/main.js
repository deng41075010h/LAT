$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
    $("#inputImageFile").change(function(e){
        processImageFile(e.target.files[0]);
    });
});

function processImageFile(imageObject) {

    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v3.2/ocr";

    var params = {
        // "visualFeatures": "Faces,Objects,Adult,Brands,Categories,Description",
        // "details": "Landmarks",
        // "maxCandidates": "10",
        "language": "en",
        "detectOrientation": "true"
    };
    //顯示分析的圖片
    // var sourceImageUrl = document.getElementById("inputImage").value;
    var sourceImageUrl = URL.createObjectURL(imageObject);
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        processData:false,
        contentType:false,
        // Request body
        data: imageObject
    })
        .done(function (data) {
            //顯示JSON內容
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            $("#picDescription").empty();
            // 提取识别到的文字
            var extractedText = extractTextFromOCRResult(data);
            $("#bookText").text(extractedText);
            // for (var x = 0; x < data.description.captions.length; x++) {
            //     $("#picDescription").append(data.description.captions[x].text + "<br>");
            // }
            // $("#picDescription").append("這裡有"+data.faces.length+"個人");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //丟出錯誤訊息
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
        // 从OCR结果中提取文字
        function extractTextFromOCRResult(ocrResult) {
            var extractedText = "";
                if (ocrResult && ocrResult.regions && ocrResult.regions.length > 0) {
                    for (var i = 0; i < ocrResult.regions.length; i++) {
                        var region = ocrResult.regions[i];
                        if (region.lines && region.lines.length > 0) {
                            for (var j = 0; j < region.lines.length; j++) {
                                var line = region.lines[j];
                                if (line.words && line.words.length > 0) {
                                    for (var k = 0; k < line.words.length; k++) {
                                        var word = line.words[k];
                                        extractedText += word.text + " ";
                                    }
                                }
                            }
                        }
                    }
                }
                return extractedText.trim();
        }
};


function processImage() {
    
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v3.2/ocr";
    
    var params = {
        // "visualFeatures": "Faces,Objects,Adult,Brands,Categories,Description",
        // "details": "Landmarks",
        // "maxCandidates":"10",
        "detectOrientation": "true",
        "language": "en"
    };
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#picDescription").empty();
        // 提取识别到的文字
        var extractedText = extractTextFromOCRResult(data);
        $("#bookText").text(extractedText);
        // for (var x = 0; x < data.description.captions.length;x++){
        //     $("#picDescription").append(data.description.captions[x].text + "<br>");
        // }
        // $("#picDescription").append("這裡有"+data.faces.length+"個人");
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
    // 从OCR结果中提取文字
    function extractTextFromOCRResult(ocrResult) {
        var extractedText = "";
            if (ocrResult && ocrResult.regions && ocrResult.regions.length > 0) {
                for (var i = 0; i < ocrResult.regions.length; i++) {
                    var region = ocrResult.regions[i];
                    if (region.lines && region.lines.length > 0) {
                        for (var j = 0; j < region.lines.length; j++) {
                            var line = region.lines[j];
                            if (line.words && line.words.length > 0) {
                                for (var k = 0; k < line.words.length; k++) {
                                    var word = line.words[k];
                                    extractedText += word.text + " ";
                                }
                            }
                        }
                    }
                }
            }
            return extractedText.trim();
    }
};