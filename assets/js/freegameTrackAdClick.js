// 定义事件名称映射对象，将自定义事件名称映射到标准化的名称
const eventNameMap = {
    am_hd: 'view_promotion',
    am_md: 'select_item'
  };
  
  // 跟踪广告点击事件
  function trackAdClick() {
    const activeElement = document.activeElement; // 获取当前活动的DOM元素
    const adIframes = document.querySelectorAll('.adsbygoogle iframe'); // 获取所有.adsbygoogle类下的iframe元素
    const adContainers = document.querySelectorAll('.adsbygoogle'); // 获取所有.adsbygoogle类的容器元素
  
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
  
  // 触发第三方事件
  function triggerThirdPartyEvent(eventName) {
      gtag("event", "clicktheAd", {});//点击广告
      if (window.ttq) {
          // 触发追踪事件
          var gameUrl = 'index';
          if (typeof(getGameUrl) != 'undefined') {
              gameUrl = getGameUrl();
          }
          console.log('点点点点点点点点点'+new Date().getTime());
          window.ttq.track('CompleteRegistration', {
              contents:[{
                  content_id: gameUrl,
                  content_type:"product",
              }]
          });
      }
  }
  
  // 跟踪模糊事件
  function trackBlurEvent() {
    const activeElement = document.activeElement; // 获取当前活动的DOM元素
    const adIframes = document.querySelectorAll('.adsbygoogle iframe'); // 获取所有.adsbygoogle类下的iframe元素
    const adContainers = document.querySelectorAll('.adsbygoogle'); // 获取所有.adsbygoogle类的容器元素
  
    // 检查是否离开了广告
    if (adIframes.length > 0 && adContainers.length > 0) {
      const adIframeElements = [...adIframes]; // 将NodeList转换为数组
      const adContainerElements = [...adContainers]; // 将NodeList转换为数组
      const isAdActive = activeElement && activeElement.tagName.toLowerCase() === 'iframe' && adIframeElements.includes(activeElement); // 检查活动元素是否是广告iframe
      const isAdContainerBlurred = !adContainerElements.some(container => container.contains(activeElement)); // 检查活动元素是否不在广告容器内

      if (isAdActive && isAdContainerBlurred) {
        const eventName = 'ad_blur'; // 定义事件名称
        triggerThirdPartyEvent(eventName); // 触发第三方事件
  
        // 移除事件监听器
        window.removeEventListener('blur', trackBlurEvent);
      }
    }
  }

function winVisibility() {
    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;

    if (!document[hiddenProperty]) {
        /*if(window.istrack){
            //执行你要的逻辑
        }*/
        console.log("^^^^^^^^^^^^^^^^^^^");
    }else{
        // console.log('expect hidden vale is:', hiddenProperty, document[hiddenProperty]);
        // window.istrack = null;
        trackAdClick();
        console.log("********************");
    }
}
  
  // 绑定事件监听器
function addMobileListenEvent() {

    // document.addEventListener('blur', trackAdClick); // 当页面失去焦点时调用trackAdClick
    // document.addEventListener('focus', () => { // 当页面获得焦点时
    //     if (document.visibilityState === 'visible') { // 检查页面是否可见
    //         trackAdClick(); // 调用trackAdClick函数
    //     }
    // });
    // window.addEventListener('visibilitychange', trackAdClick); // 当页面可见性变化时调用trackAdClick
    // window.addEventListener('visibilitychange', winVisibility);
    // window.addEventListener('blur', trackBlurEvent); // 当页面失去焦点时调用trackBlurEvent
    window.addEventListener('blur', trackAdClick); // 当页面失去焦点时调用trackBlurEvent
}
