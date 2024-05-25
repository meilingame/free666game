function getGameUrl() {
    var currentUrl = window.location.href; // 获取当前页面的完整 URL
    var currentUrlObj = new URL(currentUrl);
    var currentParams = new URLSearchParams(currentUrlObj.search);
    var currentGameParamValue = currentParams.get('game');

    // console.log(currentGameParamValue); // 输出当前 URL 中的 game 参数值
    return currentGameParamValue;
}

function iframeLoadFunc() {
    if (getDeviceType() == 'pc') {
        var iframeContentWindow = document.getElementById("gameIframeElem").contentWindow;
        var iframeWidth = parseInt($("#gameIframeElem").width());
        var iframeHeight = parseInt($("#gameIframeElem").height());
        var iframeCanvas = iframeContentWindow.canvas;
        if (iframeCanvas) {
            iframeCanvas.style.width = iframeWidth + "px";
            iframeCanvas.style.height = iframeHeight + "px";
        }
    }
}

/**
 * csv 数据添加到 html 中
 */
function appendCsvDataToHtml() {
    var gameUrlLi = getCsvData();

    var leftCount = parseInt(gameUrlLi.length / 2);
    if (gameUrlLi % 2 != 0) {
        leftCount += 1;
    }

    var leftHtmlLi = [];
    for (var i = 0; i < leftCount; i++) {
        var nineGridItemTemplateHtml = $("#nineGridAreaTemplate").html();
        var gameUrl = '/game.html?game=' + gameUrlLi[i][0].trim();
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gameUrl}/g, gameUrl);
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][1].trim());
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{flag}/g, "left");

        leftHtmlLi.push(nineGridItemTemplateHtml);
    }
    $("#cardLayoutDivLeft").append(leftHtmlLi.join(""));

    var rightHtmlLi = [];
    for (var i = 0; i < leftCount; i++) {
        var nineGridItemTemplateHtml = $("#nineGridAreaTemplate").html();
        var gameUrl = '/game.html?game=' + gameUrlLi[i][0].trim();
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gameUrl}/g, gameUrl);
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][1].trim());
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{flag}/g, "leftInRight");

        rightHtmlLi.push(nineGridItemTemplateHtml);
    }
    for (var i = leftCount; i < gameUrlLi.length; i++) {
        var nineGridItemTemplateHtml = $("#nineGridAreaTemplate").html();
        var gameUrl = '/game.html?game=' + gameUrlLi[i][0].trim();
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gameUrl}/g, gameUrl);
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][1].trim());
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{flag}/g, "right");

        rightHtmlLi.push(nineGridItemTemplateHtml);
    }

    $("#cardLayoutDivRight").append(rightHtmlLi.join(""));

    /*
    var nineGridItemTemplateHtmlLi = [];
    for (var i = 0; i < gameUrlLi.length; i++) {
        var nineGridItemTemplateHtml = $("#nineGridAreaTemplate").html();
        var gameUrl = '/game.html?game=' + gameUrlLi[i][0].trim();
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gameUrl}/g, gameUrl);
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][1].trim());

        nineGridItemTemplateHtmlLi.push(nineGridItemTemplateHtml);
    }

    $("#cardLayoutDiv").append(nineGridItemTemplateHtmlLi.join(""));
    */
}

/**
 * 匹配游戏的 url
 * @param gameUrl
 */
function getImageURL(gameUrl) {
    var gameUrlLi = getCsvData();
    for (var i = 0; i < gameUrlLi.length; i++) {
        if (gameUrlLi[i][0].trim() == gameUrl) {
            return gameUrlLi[i][1].trim();
        }
    }
    return null;
}

/**
 * 追加 GoogleAdsTemplate
 * @param resultHtmlLi
 */
/*
function appendGoogleAdsTemplate() {
    var googleAdsTemplateHtml = $("#googleAdsTemplate").html();
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleScriptContent}/g, adsbygoogleScript);
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleBottomScriptContent}/g, adsbygoogleBottomScript);
    $("#cardIframeSuperposeContentDiv").html(googleAdsTemplateHtml);
}
*/

/**
 * 点击开始游戏
 */
function play() {
    var gameUrl = getGameUrl();
    if (gameUrl) {
        $("#cardIframeSuperposeDiv").css("display", "none");
        frames['gameIframe'].location.href = gameUrl;
        var width = $(window).width() - 10;
        var height = $(window).height() - 10;
        $("#clickPlayDialog").dialog({
            modal: true,
            title: 'Advertisement',
            width: width,
            height: height,
            open: function( event, ui ) {
                var googleAdsTemplateHtml = $("#clickPlayAdsTemplate").html();
                googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleScriptContent}/g, adsbygoogleScript);
                googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleBottomScriptContent}/g, adsbygoogleBottomScript);
                googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{width}/g, (width - 10) + "px");

                $("#clickPlayDialog").html(googleAdsTemplateHtml);
            }
        });
    }
}

function trackClickPlay() {
    gtag("event", "playclick", {});//点击play按钮

    // 确保TikTok像素代码已加载
    if (window.ttq) {
        // 触发追踪事件
        var gameUrl = getGameUrl();
        window.ttq.track('AddToWishlist', {});
        /*window.ttq.track('CompleteRegistration', {
            contents:[{
                content_id: gameUrl,
                content_type:"product",
            }]
        });*/

    }
    // 调用原有的play()函数
    //play();
}

$(document).ready(function(){
    var gameUrl = getGameUrl();
    if (gameUrl) {
        // frames['gameIframe'].location.href = gameUrl;

        // if (getDeviceType() == 'pc') {
        // }
        var imageUrl = getImageURL(gameUrl);
        if (imageUrl) {
            $("#playGameImg").attr("src", imageUrl);
            $("#playGameImg").css("display", "block");
        }
    }
    appendCsvDataToHtml();
    // appendGoogleAdsTemplate();
    if (isMobile()) {
        addMobileListenEvent();
    } else {
        setInterval(scanAndAddIframes, 1000); // 5000毫秒 = 5秒
    }
});
