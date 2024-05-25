window.HUHU_success = null;
window.HUHU_failure = null;
window.HUHU_preload = null;
var interval = 50;
var huhu_s = Date.parse(new Date()) / 1000;
window.HUHU_showInterstitialAd = (preload,success,failure)=>{
    console.log("HUHU_showInterstitialAd:");
    CoinApp.showInterstitial();
    if (typeof (success) == "function") {
        //HUHU_success = success;
        success();
    }
    // if (typeof (failure) == "function") {
    //     HUHU_failure = failure;
    // }
    // if (typeof (preload) == "function") {
    //     HUHU_preload = preload;
    // }
    // var e = Date.parse(new Date()) / 1000;
    // var i = e - huhu_s;
    // console.log("interval time = " + i);
    // if (i >= interval) {
    //     huhu_s = e;
    //     console.log("------------ad1----------------");
    //     try {
    //         window.parent.postMessage("showInterstitial", "*");
    //     } catch (e) {}
    // } else {
    //     if (typeof (window.HUHU_failure) == "function") {
    //         window.HUHU_failure();
    //         window.HUHU_success = null;
    //         window.HUHU_failure = null;
    //     }
    //     ;
    // }
}
;
window.HUHU_loading_over = ()=>{
    console.log("HUHU_loading_over");
    try {
        window.parent.postMessage("loadingOver", "*");
    } catch (e) {}
}
window.HUHU_showStartAd = ()=>{
    console.log("HUHU_showStartAd:");
    try {
        window.parent.postMessage("start", "*");
    } catch (e) {}
}
window.HUHU_showRewardedVideoAd = (success,failure)=>{
    console.log("HUHU_showRewardedVideoAd:");
    CoinApp.showRewarded(success,failure);
    // if (typeof (success) == "function") {
    //     HUHU_success = success;
    // }
    // if (typeof (failure) == "function") {
    //     HUHU_failure = failure;
    // }
    // try {
    //     window.parent.postMessage("showReward", "*");
    // } catch (e) {}
}
;
window.onmessage = function(e) {
    e = e || event;
    let tempData = e.data + "";
    if (tempData == "close") {
        if (typeof (window.HUHU_success) == "function") {
            window.HUHU_success();
            window.HUHU_success = null;
            window.HUHU_failure = null;
        }
        ;
    } else if (tempData == "fail") {
        if (typeof (window.HUHU_failure) == "function") {
            window.HUHU_failure();
            window.HUHU_success = null;
            window.HUHU_failure = null;
        }
        ;
    } else if (tempData == "adload") {
        if (typeof (window.HUHU_preload) == "function") {
            window.HUHU_preload();
            window.HUHU_preload = null;
        }
        ;
    }
}
function promptTxT(msg, duration) {
    if (!this.prompt_) {
        this.prompt_ = document.createElement('div');
        this.prompt_.style.cssText = "font-family:siyuan;max-width:80%;min-width:320px;padding:10px 10px 10px 10px;min-height:40px;color: rgb(255, 255, 255);line-height: 20px;text-align:center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(this.prompt_);
    }
    this.prompt_.innerHTML = msg;
    duration = isNaN(duration) ? 2000 : duration;
    this.prompt_.style.display = "inline";
    this.prompt_.style.opacity = '1';
    setTimeout(function() {
        var d = 0.5;
        this.prompt_.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        this.prompt_.style.opacity = '0';
        this.prompt_.style.display = "none";
    }
    .bind(this), duration);
}
window.cy_Sdk = {
    GAME_START: "game_start",
    LOADING_BEGIN: "loading_begin",
    LOADING_END: "loading_end",
    LOAD_ADSBYGOOGLE: "load_adsbygoogle",
    LOADED_ADSBYGOOGLE: "loaded_adsbygoogle",
    TURN_SCREEN: "turn_screen",
    HORIZONTAL: "horizontal",
    GAME_PAGE: "game_page",
    LEVEL_BEGIN: "level_begin",
    LEVEL_END: "level_end",
    LEVEL_REWARD: "level_reward",
    LEVEL_NEXT: "level_next",
    REWARD_CLICK: "reward_click",
    PLAY_TIME: "play_time",
    adShow: ()=>{
        try {
            window.parent.postMessage("adShow", "*");
        } catch (e) {}
    }
    ,
    adHide: ()=>{
        try {
            window.parent.postMessage("adHide", "*");
        } catch (e) {}
    }
    ,
    reportPlayTime: ()=>{
        try {
            window.parent.postMessage("reportPlayTime", "*");
        } catch (e) {}
    }
    ,
    ga: function() {
        switch (arguments.length) {
        case 1:
            try {
                window.parent.postMessage("dot|" + arguments[0], "*");
            } catch (e) {}
            break;
        case 2:
            try {
                window.parent.postMessage("dot|" + arguments[0] + "|" + arguments[1], "*");
            } catch (e) {}
            break;
        case 3:
            try {
                window.parent.postMessage("dot|" + arguments[0] + "|" + arguments[1] + "|" + arguments[2], "*");
            } catch (e) {}
            break;
        }
    }
}
