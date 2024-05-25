/**
 * 追加 cardTemplateHtml
 * @param resultHtmlLi
 * @param nineGridItemTemplateHtmlLi
 */
function appendCardTemplateHtml(resultHtmlLi, nineGridItemTemplateHtmlLi) {
    var cardTemplateHtml = $("#cardTemplate").html();
    cardTemplateHtml = cardTemplateHtml.replace(/{nineGridItemContent}/g, nineGridItemTemplateHtmlLi.join(""));
    resultHtmlLi.push(cardTemplateHtml);
}

/**
 * 添加 PopularGame div
 * @param resultHtmlLi
 */
function appendPopularGameTemplateHtml(resultHtmlLi) {
    var popularGameTemplateHtml = $("#popularGameTemplate").html();

    var googleAdsTemplateHtml = $("#googleAdsTemplatePopular").html();
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleScriptContent}/g, adsbygoogleScript);
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleBottomScriptContent}/g, adsbygoogleBottomScript);

    popularGameTemplateHtml = popularGameTemplateHtml.replace(/{threeGameAreaContextDetailAdsContent}/g, googleAdsTemplateHtml);

    resultHtmlLi.push(popularGameTemplateHtml);
}

/**
 * 追加 GoogleAdsTemplate
 * @param resultHtmlLi
 */
function appendGoogleAdsTemplate(resultHtmlLi) {
    var googleAdsTemplateHtml = $("#googleAdsTemplate").html();
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleScriptContent}/g, adsbygoogleScript);
    googleAdsTemplateHtml = googleAdsTemplateHtml.replace(/{adsbygoogleBottomScriptContent}/g, adsbygoogleBottomScript);
    resultHtmlLi.push(googleAdsTemplateHtml);
}

/**
 * csv 数据添加到 html 中
 */
function appendCsvDataToHtml() {
    var gameUrlLi = getCsvData();
    var resultHtmlLi = [];

    var nineGridItemTemplateHtmlLi = [];

    var itemCount = 9;

    var isAddPopularGame = false;
    var isAddGoogleAds = false;

    var googleAdsIndex = 4;
    if (getDeviceType() == 'mobile') {
        googleAdsIndex = 3;
    }

    for (var i = 0; i < gameUrlLi.length; i++) {
        var nineGridItemTemplateHtml = $("#nineGridItemTemplate").html();
        var gameUrl = '/game.html?game=' + gameUrlLi[i][0].trim();
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gameUrl}/g, gameUrl);
        nineGridItemTemplateHtml = nineGridItemTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][1].trim());

        nineGridItemTemplateHtmlLi.push(nineGridItemTemplateHtml);

        if (i == 8) {
            appendCardTemplateHtml(resultHtmlLi, nineGridItemTemplateHtmlLi);
            nineGridItemTemplateHtmlLi = [];

            // popularGameTemplate
            appendPopularGameTemplateHtml(resultHtmlLi);
            isAddPopularGame = true;
        } else if (nineGridItemTemplateHtmlLi.length == itemCount) {
            appendCardTemplateHtml(resultHtmlLi, nineGridItemTemplateHtmlLi);
            nineGridItemTemplateHtmlLi = [];
        }

        if (resultHtmlLi.length == (googleAdsIndex - 1)) {
            appendGoogleAdsTemplate(resultHtmlLi);
            isAddGoogleAds = true;
        }
    }

    if (nineGridItemTemplateHtmlLi.length > 0) {
        appendCardTemplateHtml(resultHtmlLi, nineGridItemTemplateHtmlLi);
        nineGridItemTemplateHtmlLi = [];
    }

    if (!isAddPopularGame) {
        appendPopularGameTemplateHtml(resultHtmlLi);
    }
    if (!isAddGoogleAds) {
        appendGoogleAdsTemplate(resultHtmlLi);
    }

    $("#cardLayoutDiv").html(resultHtmlLi.join(""));
}

$(document).ready(function(){
    appendCsvDataToHtml();
    if (isMobile()) {
        addMobileListenEvent();
    } else {
        setInterval(scanAndAddIframes, 1000); // 5000毫秒 = 5秒
    }
});
