(function() {
// 发送埋点
var pid = 'overseas';

window.__UDL_CONFIG = window.__UDL_CONFIG || {};
window.__UDL_CONFIG.pid = pid;
window.__UDL_CONFIG.ljweb_channel_key = _old_dig_action_PC.ljweb_channel_key;
window.__UDL_CONFIG.action = {
    nation_id: _old_dig_action_PC.action.nation_id
}

var env = document.getElementById('env').dataset.env;
// 统计上报目标
if (env == 'developer' || env == 'test') {
    var digUrl = '//test.dig.lianjia.com';
} else {
    var digUrl = '//dig.lianjia.com';
}

// 埋点：http://git.lianjia.com/lianjia-fe/dig-log
(function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n){!function(e){if(!window.$ULOG||1!==window.$ULOG.state){var n={add:function(e,n,t){e.addEventListener?e.addEventListener(n,t,!1):e.attachEvent?e.attachEvent("on"+n,t):null===e["on"+n]&&(e["on"+n]=t)},remove:function(e,n,t){e.removeEventListener?e.removeEventListener(n,t,!1):e.dispatchEvent?e.detachEvent("on"+n,t):e["on"+n]=null}},t={extend:function(e,n){if(null==e||"object"!=typeof e)return e;if(e.constructor!=Object&&e.constructor!=Array)return e;if(e.constructor==Date||e.constructor==RegExp||e.constructor==Function||e.constructor==String||e.constructor==Number||e.constructor==Boolean)return new e.constructor(e);n=n||new e.constructor;for(var o in e)e.hasOwnProperty(o)&&(n[o]=void 0===n[o]?t.extend(e[o],null):n[o]);return n},getIndex:function(e,n){if(n.indexOf)return n.indexOf(e);for(var t=0,o=n.length;t<o;t++)if(n[t]===e)return t;return-1},getCookie:function(e){if(document.cookie.length>0){var n=document.cookie.indexOf(e+"=");if(-1!=n){n=n+e.length+1;var t=document.cookie.indexOf(";",n);return-1==t&&(t=document.cookie.length),decodeURIComponent(document.cookie.substring(n,t))}}return""}},o={send:function(e){var n=new Image,te=(digUrl + '/t.gif'),o=[];try{if(!!e.uicode){te=(digUrl+'/bigc.gif');e.token=t.getCookie("lianjia_token")}e=encodeURIComponent(JSON.stringify(e))}catch(e){}e&&(o.push("r="+ +new Date),o.push("d="+e)),te+="?"+o.join("&"),n.onload=n.onerror=function(){n=null},n.src=te},makeParam:function(n){var o={};return o=t.extend(n,o),o=t.extend(e,o),o=t.extend({key:window.location.href,uuid:t.getCookie("lianjia_uuid"),ssid:t.getCookie("lianjia_ssid")},o)},parseElement:function(e){var n=e.tagName.toLowerCase(),o=e.className.replace(/ /g,""),r=e.id;o=0==o.length?"":"."+o.replace(/ /g,"."),r=0==r.length?"":"#"+r;var i=n+r+o;return{selector:i,index:null===e.parentElement?0:t.getIndex(e,Array.prototype.slice.apply(e.parentElement.querySelectorAll(i)))}},loadTime:(new Date).getTime(),buffer:[]};window.$ULOG&&void 0===window.$ULOG.state&&window.$ULOG.buffer&&window.$ULOG.buffer.length>0&&(o.buffer=t.extend(window.$ULOG.buffer,[])),window.$ULOG={send:function(e,n){n=n||{},n.evt=e+"";var r=o.makeParam(n);switch(n.evt){case"1":o.send(t.extend({cid:t.getCookie("select_city")||""},r));break;case"2":var i=Math.round(((new Date).getTime()-o.loadTime)/1e3);o.send(t.extend({stt:i},r));break;case"3":o.send(t.extend({f:document.referrer||"",cid:t.getCookie("select_city")||""},r));break;case"4":break;case"1,3":o.send(t.extend({f:document.referrer||"",cid:t.getCookie("select_city")||""},r));break;default:o.send(r)}},update:function(n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])},state:1};for(var r in o.buffer)if(o.buffer.hasOwnProperty(r)){var i=o.buffer[r];"string"==typeof i?window.$ULOG.send(i):window.$ULOG.send(i[0],i[1])}window.$ULOG.send("1,3"),n.add(window,"beforeunload",function(){window.$ULOG.send("2")}),n.add(document.documentElement,"mousedown",function(e){window.$ULOG.send("4")})}}(window.__UDL_CONFIG||{})}]));
})()
