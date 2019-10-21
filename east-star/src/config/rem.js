/** 
 * 解决移动端适配问题
 */

(function () {
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  let htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = htmlWidth / 23.4375 + 'px';
})()

