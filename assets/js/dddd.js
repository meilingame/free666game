var IframeOnClick = {

istrack:null,

resolution: 200,

iframes: [],

interval: null,

Iframe: function() {

this.element = arguments[0];

this.cb = arguments[1];

this.hasTracked = false;

},

track: function(element, cb) {

this.iframes.push(new this.Iframe(element, cb));

if (!this.interval) {

var _this = this;

this.interval = setInterval(function() {

 _this.checkClick();

}, this.resolution);

 }

},

checkClick: function() {

if (document.activeElement) {

var activeElement = document.activeElement;

var tagName = activeElement.tagName;

for (var i in this.iframes) {

if (activeElement === this.iframes[i].element) {

　if (this.iframes[i].hasTracked == false) {

this.iframes[i].cb.apply(window, []);

this.iframes[i].hasTracked = true; }

　}

}

　}

 }

};

window.onload = function(){

var ifs = document.getElementsByClassName("iframe");

for (var i = 0; i < 12; i++) {

IframeOnClick.track(ifs[i], function() {

 console.log("click")；

//　这里写一些业务逻辑，例如给变量添加状态

IframeOnClick.istrack = true;

});

}

}