/**
 * csv 数据添加到 html 中
 */
function appendCsvDataToHtml() {
    var gameUrlLi = getCsvData();
    var htmlLi = [];
    for (var i = 0; i < gameUrlLi.length; i++) {
        var gameTemplateHtml = $("#gameTemplate").html();
        gameTemplateHtml = gameTemplateHtml.replace(/{gameUrl}/g, gameUrlLi[i][0].trim());
        if (gameUrlLi[i][2] && gameUrlLi[i][2].trim()) {
            gameTemplateHtml = gameTemplateHtml.replace(/{gamePic}/g, gameUrlLi[i][2].trim());
            htmlLi.push(gameTemplateHtml);
        }
    }
    $("#gameArea").append(htmlLi.join(""));
}

// 回调函数，在DOM发生变化时被调用
function mutationCallback(mutationsList, observer) {
    // 遍历所有变动
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {

            // const adIframes = document.querySelectorAll('.adsbygoogle iframe');
            const adIframe = mutation.target.querySelectorAll('.adsbygoogle iframe');
            if (adIframe && adIframe.length > 0) {
                if (!isMobile()) {
                    console.log("add event begin");
                    console.log(adIframe[0]);
                    addWindowBlurFunc();
                    addIframeEvent(adIframe[0]);
                    console.log("add event end");
                }
            }

            console.log(mutation.addedNodes);
            console.log(mutation.removedNodes);
            // mutation.target 是发生变动的节点
            // mutation.addedNodes 是新增的节点
            // mutation.removedNodes 是被移除的节点
        } else if (mutation.type === 'attributes') {
            console.log('属性被修改');
        }
        // ... 其他类型的变动
    }
}

function addIframeEvent(adIframe) {
    $(adIframe)
        .mouseover(
            function(){
                isOverGoogleAd = true;
            }
        )
        .mouseout(
            function(){
                isOverGoogleAd = false;
            }
        )
    ;
}

// var elemName = "bottomDiv";
var elemName = "topAdsArea";

// 跟踪广告点击事件
function mobileTrackAdClick() {
    const activeElement = document.activeElement; // 获取当前活动的DOM元素
    // var topAdsAreaContainer = document.getElementById("topAdsArea");
    var topAdsAreaContainer = document.getElementById(elemName);
    const adIframes = topAdsAreaContainer.querySelectorAll('.adsbygoogle iframe'); // 获取所有.adsbygoogle类下的iframe元素
    const adContainers = topAdsAreaContainer.querySelectorAll('.adsbygoogle'); // 获取所有.adsbygoogle类的容器元素

    // 检查是否点击了广告
    if (adIframes.length > 0 && adContainers.length > 0) {
        const adIframeElements = [...adIframes]; // 将NodeList转换为数组
        const adContainerElements = [...adContainers]; // 将NodeList转换为数组
        const isAdActive = activeElement && activeElement.tagName.toLowerCase() === 'iframe' && adIframeElements.includes(activeElement); // 检查活动元素是否是广告iframe
        const isAdContainerClicked = adContainerElements.find(container => container.contains(activeElement)); // 检查活动元素是否在广告容器内

        if (isAdActive && isAdContainerClicked && isAdContainerClicked.getAttribute('data-ad-status') === 'filled') {
            const eventName = 'ad_interaction'; // 定义事件名称
            triggerThirdPartyEvent(eventName); // 触发第三方事件
        }
    }
}

function addAdMobileListenEvent() {
    window.addEventListener('blur', mobileTrackAdClick); // 当页面失去焦点时调用trackBlurEvent
}

function getGameUrl() {
    // getCsvData();
    return "single_ad";
}

$(document).ready(function(){
    appendCsvDataToHtml();

    if (isMobile()) {
        addAdMobileListenEvent();
    } else {
        // 创建一个新的MutationObserver实例，并传入回调函数
        const observer = new MutationObserver(mutationCallback);
        // 选择要观察的DOM元素
        // const targetNode = document.getElementById('topAdsArea');
        const targetNode = document.getElementById(elemName);

        // 观察选项：
        // { attributes: true, childList: true, subtree: true }
        // attributes: 观察属性的变动
        // childList: 观察子节点的变动
        // subtree: 是否将观察器应用于该节点的所有后代节点
        const config = { attributes: false, childList: true, subtree: true };

        // 传入目标节点和观察选项
        observer.observe(targetNode, config);
    }

    $("#topAdsArea ins.adsbygoogle").click(function(){
        console.log("click ins");
    });

    /*
    setTimeout(function(){
        var frameTemplateHtml = $("#frameTemplate").html();
        $("#bottomDiv .adsbygoogle").html(frameTemplateHtml);
    }, 3000);
    */
});
