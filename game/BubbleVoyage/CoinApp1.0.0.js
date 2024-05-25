var CoinApp = (function () {
    function CoinApp() {
        if (CoinApp.instance) {
            console.log("can not new App again");
        }
    };

    /**
     * @description 分享
     * @param text 分享文字，可以传入本身游戏的游戏名称，或者一句好玩的英文
     * @param image 分享图的base64 ,默认可以用物料图中的1200*627
    */
    CoinApp.shareAsync = async function (text = "Smile Game", image = window.fbShareCfg.share_icon) {
        if (!FBInstant) {
            return;
        }
        FBInstant.shareAsync({
            image: image,
            text: text,
            data: { myReplayData: '...' },
            switchContext: false,
        }).then(function () {
            // continue with the game.
        });
    }

    /**
     * @description 创建快捷方式异步 安卓手机特有
    */
    CoinApp.createShortcutAsync = async function () {
        if (!FBInstant) {
            return;
        }
        if (!FBInstant.canCreateShortcutAsync) {
            console.log("环境不支持 创建快捷方式 canCreateShortcutAsync");
            return;
        }
        FBInstant.canCreateShortcutAsync()
            .then(function (canCreateShortcut) {
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(function () {
                            // Shortcut created
                        })
                        .catch(function () {
                            // Shortcut not created
                        });
                }
            });
    }

    /**
     * @description 清楚存储数据
    */
    CoinApp.clear = async function () {
        await window.FBInstant.player.setDataAsync({}).then(function () {
            console.log('data is clear');
        });
    }

    /**
     * @description 设置存储数据
     * @param _key 
     * @param _str
    */
    CoinApp.setItem = async function (_key, _str) {
        let playerData = window.localStorage.getItem("playerData") || "{}";
        playerData = JSON.parse(playerData);

        let tempObject = {};
        tempObject[_key] = _str;
        let object = Object.assign(playerData, tempObject);

        // window.localStorage.setItem("playerData",JSON.stringify(object));

        await window.FBInstant.player.setDataAsync(object).then(function () {
            console.log('data is set');
        });
    }

    /**
     * @description 关键数据立即刷新
    */
    CoinApp.flushDataAsync = async function () {
        await FBInstant.player.flushDataAsync();//刷新数据
    }

    /**
     * @description 获取存储数据
     * @param key 
    */
    CoinApp.getItem = async function (key) {
        let data = await FBInstant.player.getDataAsync([key]);

        // let playerData = window.localStorage.getItem("playerData") || "{}";
        // playerData = JSON.parse(playerData);

        // playerData[key] =  data[key];

        // window.localStorage.setItem("playerData",JSON.stringify(playerData));

        return data[key];
    }

    /**
     * @description 删除存储数据
     * @param key 
    */
    CoinApp.removeItem = async function (key) {
        await CoinApp.setItem(key, "");
    }

    /**
    * @description 获取存储数据 json
    * @param key 
   */
    CoinApp.getJSON = async function (key) {
        let data = await CoinApp.getItem(key);
        if (typeof data == "string") {
            data = JSON.parse(data);
        }
        return data;
    }

    /**
     * @description 设置存储数据 json
     * @param _key 
     * @param _str
    */
    CoinApp.setJSON = async function (key, _str) {
        if (typeof _str == "object") {
            _str = JSON.stringify(_str);
        }
        await CoinApp.setItem(key, _str);
    }

    /**
     * @description fb 模拟加载
    */
    CoinApp.startShowLoading = async function (fun) {
        let i = 1;
        let max = 90;
        FBInstant.setLoadingProgress(1);
        window.progressTimer = setInterval(() => {
            i++;
            FBInstant.setLoadingProgress(i / 100 * 100);
            i = Math.min(max, i);

            if (i == max) {
                i = max;
                clearInterval(window.progressTimer);
                window.progressTimer = null;
            }
            fun && fun(i, max);
        }, 700);
    }

    CoinApp.isEnableAD = false;
    CoinApp.initAd = function () {
        CoinApp.AD_ID_REWARD = "";//激励
        CoinApp.AD_ID_INTER = "";//插屏
        CoinApp.AD_ID_BANNER = "";//banner

        //两次插屏广告之间的弹出间隔
        CoinApp.showRewardTimeDelt = 2000;

        //两次插屏广告之间的弹出间隔
        CoinApp.showInterstitialTimeDelt = 10000;

        // 两次banner广告之间的弹出间隔
        CoinApp.showBannerTimeDelt = 30000;

        //加载插屏广告是否播放的时候再去加载
        CoinApp.isNeedLoadInterstitial = false;

        //是否启用广告，送审前要先关闭
        CoinApp.isEnableAD = false;

        //是否预加载插屏广告 ***************游戏内自行完善***************
        if (!CoinApp.isNeedLoadInterstitial) {
            CoinApp.startPreLoad();
        }
    }
    /**
     * 显示进度条
     * @param {*} progress 
     */
    CoinApp.setLoadingProgress = function (progress) {
        if (CoinApp.isOnStarted) {
            //已经初始化过
            console.log("fb  isOnStarted")
            return;
        }
        FBInstant.setLoadingProgress(progress)
    }
    /**
     * @description fb游戏开始
    */
    CoinApp.onStart = function (complete) {
        if (CoinApp.isOnStarted) {
            //已经初始化过
            return;
        }
        CoinApp.isOnStarted = true;

        if (window['progressTimer']) {
            clearInterval(window.progressTimer);
            window.progressTimer = null;
        }

        if (!!window['FBInstant']) {
            window['FBInstant'].setLoadingProgress(100);
            window['FBInstant'].startGameAsync().then(() => {
                console.log("fb游戏开始");
                console.log('player=getPhoto===', FBInstant.player.getPhoto());
                console.log('player==getName==', FBInstant.player.getName());
                console.log('player=getID===', FBInstant.player.getID());
                console.log('==context=getType=', FBInstant.context.getType());
                console.log('==context=getID=', FBInstant.context.getID());

                CoinApp.isOpenRank && CoinApp.fetchLeaderboard();
                CoinApp.initAd && CoinApp.initAd();
                complete && complete();

            }).catch(function (b) {
                console.log(b.message);
            });
        }
    }

    //插屏广告
    CoinApp.loadedAd = null;
    CoinApp.preLoadRunning = !1;
    CoinApp.retryTime = 32000;
    CoinApp.retryCount = 0;
    CoinApp.stopRetry = !1;
    CoinApp.stopBeHandle = !1;
    CoinApp.hasRemoveAD = !1;

    /**
     * @description 一进入游戏就预加载插屏广告，这种模式，需要后面有自动弹出插屏的机会，不然会使得展示率很低
    */
    CoinApp.startPreLoad = function () {
        if (!FBInstant.getInterstitialAdAsync) {
            return;
        }
        CoinApp.hasRemoveAD || (setInterval(CoinApp.checkHasAd, CoinApp.retryTime),
            CoinApp.checkHasAd())
    }


    CoinApp.checkHasAd = function () {
        CoinApp.stopBeHandle ? CoinApp.stopBeHandle = !1 : null != CoinApp.loadedAd || CoinApp.stopRetry || CoinApp.preLoadAd()
    }

    CoinApp.preLoadAd = function () {
        if (!CoinApp.preLoadRunning && !CoinApp.loadedAd) {
            CoinApp.preLoadRunning = !0;
            var a = CoinApp, b;
            FBInstant.getInterstitialAdAsync(CoinApp.AD_ID_INTER).then(function (c) {
                console.log("ready pre load AD");
                b = c;
                return b.loadAsync()
            }).then(function () {
                console.log("Interstitial video preloaded");
                a.loadedAd = b;
                a.preLoadRunning = !1
            }).catch(function (b) {
                console.log("Interstitial video failed to preload: " + b.message);
                console.log("code", b.code);
                a.preLoadRunning = !1;
                a.retryCount++;
                3 <= a.retryCount && (a.stopRetry = !0,
                    a.stopBeHandle = !0)
            })
        }
    }

    /**
     * @description  两次插屏广告之间的弹出间隔
     */
    CoinApp.showInterstitialTimeDelt = 10000;

    CoinApp.showApkRewarded = function (success = null, failure = null) {
        console.log("showApkRewarded");
        if (!CoinApp.isEnableAD) {
            success && success();
            success = null;
            return;
        }
        CoinApp.beforeShowAd();
        CoinApp.showRewardedSuccess = success;
        CoinApp.showRewardedFailure = failure;
        H5JS.showRewardedVideo();
    }
    /**
    * @description APK 激励视频显示完成
    */
    CoinApp.onRewardedVideoCompleted = function () {
        console.log("onRewardedVideoCompleted");
        CoinApp.afterShowAd();
        if (CoinApp.showRewardedSuccess) {
            CoinApp.showRewardedSuccess();
        }
        
        CoinApp.showRewardedSuccess = null;
    }
    /**
    * @description APK 激励视频失败
    */
    CoinApp.onRewardedVideoFailed = function () {
        console.log("onRewardedVideoFailed");
        if (CoinApp.showRewardedFailure) {
            CoinApp.afterShowAd();
            CoinApp.showRewardedFailure();
        }else{
            CoinApp.onRewardedVideoCompleted();
        }
       
        CoinApp.showRewardedFailure = null;
    }
   
    /**
     * @description APK 显示插屏广告
     */
    CoinApp.showApkInterstitial = function (complete) {
        console.log("showApkInterstitial");
        if (!CoinApp.isEnableAD) {
            complete && complete();
            complete = null;
            return;
        }
        CoinApp.InterstitialComplete = complete;
        CoinApp.beforeShowAd();
        H5JS.showInterstitial();
    }
    CoinApp.onInterstitialCompleted = function () {
        console.log("onInterstitialCompleted");
        CoinApp.afterShowAd();
        if (CoinApp.InterstitialComplete) {
            CoinApp.InterstitialComplete();
        }
        CoinApp.InterstitialComplete = null;
    }
    /**
     * @description fb 显示插屏广告
     */
    CoinApp.showInterstitial = function (complete) {
        //如果是送审版 ***************游戏内自行完善***************
        console.log("CoinApp.showInterstitial");
        if (!CoinApp.isEnableAD) {
            complete && complete();
            complete = null;
            return;
        }
        if(window["H5JS"]){
            CoinApp.showApkInterstitial(complete);
            return;
        }
        if (window.location && window.location.href && window.location.href.indexOf("localhost") != -1) {
            complete && complete();
            complete = null;
            return;
        }

        if (CoinApp.hasRemoveAD) {
            complete && complete();
            complete = null;
        }
        else {
            //两次插屏广告之间的弹出间隔不得<60秒 ***************游戏内自行完善***************
            var now = Date.parse(new Date());
            if (CoinApp.showInterTimestamp) {
                var off = now - CoinApp.showInterTimestamp;
                if (off <= CoinApp.showInterstitialTimeDelt) {
                    console.log('时间少于x秒，不弹出插屏广告！！！');
                    complete && complete();
                    complete = null;
                    return;
                }
            }
            CoinApp.showInterTimestamp = now;

            //是否需要现用现加载 ****************游戏内自行完善***************
            if (CoinApp.isNeedLoadInterstitial) {
                //开始游戏时，没有预加载使用这种模式
                let ad_ins = null;
                FBInstant.getInterstitialAdAsync(CoinApp.AD_ID_INTER)
                    .then(function (temp) {
                        // Load the Ad asynchronously
                        console.log("插屏广告 成功获得实例");
                        ad_ins = temp;
                        return ad_ins.loadAsync();
                    }).then(function () {
                        console.log("插屏广告 加载成功回调");
                        CoinApp.beforeShowAd();
                        return ad_ins.showAsync()
                    })
                    .then(function () {
                        console.log("插屏广告 广告显示成功");
                        CoinApp.afterShowAd();
                        complete && complete();
                        complete = null;
                    }).catch(function (b) {
                        console.log(b.message);
                        console.log("插屏广告 广告显示失败-----------1");
                        CoinApp.afterShowAd();
                        complete && complete();
                        complete = null;
                    })
            } else {
                //游戏中，每关有自动弹出的使用这种模式，要配合开始游戏做预加载
                CoinApp.stopRetry = !1;
                if (CoinApp.loadedAd) {
                    CoinApp.beforeShowAd();
                    CoinApp.loadedAd.showAsync().then(function () {
                        console.log("InterstitialAd 广告显示成功");
                        CoinApp.loadedAd = null;
                        CoinApp.stopBeHandle = !0;
                        CoinApp.afterShowAd();
                        complete && complete();
                        complete = null;
                    }).catch(function (c) {
                        CoinApp.loadedAd = null;
                        console.log("InterstitialAd 广告显示失败");
                        console.log(c.code, c.message);
                        CoinApp.stopBeHandle = !0;
                        CoinApp.afterShowAd();
                        complete && complete();
                        complete = null;
                    })
                } else {
                    console.log("RewardedVideo 广告未加载好");
                    CoinApp.afterShowAd();
                    complete && complete();
                    complete = null;
                }
            }
        }
    }
    /**
    * @description fb log
    */
    CoinApp.logEvent = function (a, b, c) {
        console.log("打点:", a, b, c);
        // FBInstant.logEvent(a, b, c);
    }

    /**
     * @description 激励视频看了几次统计
    */
    CoinApp.watchNum = 0;

    /**
     * @description 两次插屏广告之间的弹出间隔
    */
    CoinApp.showRewardTimeDelt = 2000;

    /**
     * @description fb 显示激励视频
     */
    CoinApp.showRewarded = function (success = null, failure = null) {
        //如果是送审版 ***************游戏内自行完善***************
        console.log("CoinApp.showRewarded"+CoinApp.isEnableAD)
        if (!CoinApp.isEnableAD) {
            success && success();
            success = null;
            return;
        }
        if(window["H5JS"]){
            console.log("showRewarded3")
            CoinApp.showApkRewarded(success,failure);
            return;
        }
        if (window.location && window.location.href && window.location.href.indexOf("localhost") != -1) {
            success && success();
            success = null;
            return;
        }

        //两次激励视频广告之间的弹出间隔不得<x秒  ***************游戏内自行完善***************
        var now = Date.parse(new Date());
        if (CoinApp.showAdRewardTimestamp) {
            var off = now - CoinApp.showAdRewardTimestamp;
            if (off <= CoinApp.showRewardTimeDelt) {
                console.log('不弹出激励视频广告！！！');
                return;
            }
        }
        CoinApp.showAdRewardTimestamp = now;


        var d = null;
        FBInstant.getRewardedVideoAsync(CoinApp.AD_ID_REWARD).then(function (a) {
            console.log("RewardedVideo  加载成功回调");
            d = a;
            return d.loadAsync()
        }).then(function () {
            console.log("RewardedVideo 加载成功回调");
            CoinApp.beforeShowAd();
            return d.showAsync()
        }).then(function () {
            console.log("RewardedVideo 广告显示成功");
            CoinApp.afterShowAd();
            CoinApp.watchNum += 1;
            success && success();
            success = null;
        }).catch(function (b) {
            console.log(b.message);
            console.log("RewardedVideo 广告显示失败-----------1");
            CoinApp.afterShowAd();
            failure && failure();
            failure = null;
            console.log("RewardedVideo 广告显示失败------------2")
        })
    }



    /**
    * @description  两次banner广告之间的弹出间隔
    */
    CoinApp.showBannerTimeDelt = 30000;

    /**
    * @description  显示banner
    */
    CoinApp.showBanner = function (success, failure) {
        console.log("showBanner");
        if(window["H5JS"]){
            window["H5JS"].showBannerAD();
        }
        // if (!FBInstant) {
        //     return;
        // }
        // if (!FBInstant.loadBannerAdAsync) {
        //     return;
        // }

        // if (!CoinApp.AD_ID_BANNER) {
        //     return;
        // }

        // //两次banner广告之间的弹出间隔不得<x秒  ***************游戏内自行完善***************
        // var now = Date.parse(new Date());
        // if (CoinApp.showAdBannerTimestamp) {
        //     var off = now - CoinApp.showAdBannerTimestamp;
        //     if (off <= CoinApp.showBannerTimeDelt) {
        //         console.log('不弹出banner广告！！！');
        //         return;
        //     }
        // }
        // CoinApp.showAdBannerTimestamp = now;

        // FBInstant.loadBannerAdAsync(
        //     CoinApp.AD_ID_BANNER
        // ).then(() => {
        //     console.log('success banner');
        // }).catch(function (error) {

        //     console.log(error.message);
        // });
    }

    /**
    * @description fb 隐藏banner
    */
    CoinApp.hideBanner = function (success, failure) {
        console.log("CoinApp.hideBanner");
        if(window["H5JS"]){
            window["H5JS"].hideBannerAD();
        }
        // if (!FBInstant) {
        //     return;
        // }
        // if (!FBInstant.hideBannerAdAsync) {
        //     return;
        // }

        // FBInstant.hideBannerAdAsync();
    }

    /**
    * @description 看广告前的游戏处理
    */
    CoinApp.beforeShowAd = function () {

    }
    /**
    * @description 看广告后的游戏处理
    */
    CoinApp.afterShowAd = function () {

    }




    /**
     * @description 提交最好成绩到排行榜
     * @param bestValue 最好成绩
     * @param success 成功回调
     * @param fail 失败回调
    */
    CoinApp.submitBestValueToRank = function (bestValue, success = null, fail = null) {
        if (!CoinApp.isSupport()) {
            return;
        }
        CoinApp.leaderboard.setScoreAsync(bestValue)
            .then(function (entry) {
                return CoinApp.leaderboard.getEntriesAsync();
            })
            .then((res) => {
                console.log("==rank data=====", res);
                success && success(res);
                success = null;
            })
            .catch(function (error) {
                console.error('Error sending score: ' + error.message);
                fail && fail(res);
                fail = null;
            });
    }

    /**
     * @description 是否支持排行榜，solo环境下不支持排行榜
    */
    CoinApp.isSupport = function () {
        CoinApp.contextID = FBInstant.context.getID();
        if (CoinApp.contextID) {
            return true;
        }
        console.log("当前环境不支持排行榜");
        return false;
    }

    /**
     * @description 获取排行榜数据
     * @param success 成功回调
     * @param fail 失败回调
    */
    CoinApp.fetchLeaderboard = function (success = null, fail = null) {
        if (!CoinApp.isSupport()) {
            return;
        }

        // If the leaderboard name is not found in your
        // app's configuration, the promise will reject
        FBInstant.getLeaderboardAsync(CoinApp.LEADERBOARD_NAME + "." + CoinApp.contextID)
            .then(function (result) {
                CoinApp.leaderboard = result;
                let name = CoinApp.leaderboard.getName();
                let contextID = CoinApp.leaderboard.getContextID();
                console.log("==leaderboard==name===contextID==", name, contextID);
                return CoinApp.leaderboard.getEntriesAsync();
            })
            .then((res) => {
                console.log("==fetchLeaderboard=====", res);
                if (res && res.length) {
                    for (let index = 0; index < res.length; index++) {
                        let element = res[index];
                        let playInfo = element.getPlayer();
                        console.log(element.getFormattedScore(), playInfo.getPhoto());
                    }
                }
                success && success(res);
                success = null;
            })
            .catch(function (error) {
                console.error('Leaderboard is not found in app configuration');
                fail && fail(res);
                fail = null;
            });
    }

    return CoinApp;
})();

CoinApp.init = function () {
    if (!CoinApp.instance) {
        CoinApp.instance = new CoinApp();
    }
}
CoinApp.prototype.__class__ = "CoinApp";

CoinApp.init();




