(function() {
  // var textArr = ['我是旭旭乐', '旭旭乐是我', '哈哈哈哈。'];
  // var startMode = 'sub'; //开始时的方式，add:文字先从0开始增加，sub: 文字先从数组第一个元素开始减
  // var subTime = 200;
  // var addTime = 200;
  // var spanTime = 1500; // 每次切换时的时间间隔
  // var initTime = 1500; // 初始化时停留的时间
  // var _index = 0; // 当前数组索引
  // var circulation = false; // 是否循环
  // var reverse = true; // 循环的模式（只有当circulation设置为true时才生效），如果为true，从头到尾，再从尾到头。
  // var endRemoveCursor = true; // 结束时删除光标
  // var removeCursor = function () {}; //结束时删除光标

  var _index = 0; // 当前数组索引

  var options = {
    color: '#000', // 光标颜色
    width: 3, // 光标宽度，单位/px
    height: 18, // 光标高度，单位/px
    blinkTime: 0.8, // 一次闪烁的时间，单位/s
    textArr: [],
    startMode: 'sub',
    subTime: 200,
    addTime: 200,
    spanTime: 1500,
    initTime: 1500,
    circulation: false,
    reverse: true,
    endRemoveCursor: true,
    removeCursor: function() {}
  }
  // 减文字
  function subFont(el, time) {
    setTimeout(function () {
      el.innerText = el.innerText.substr(0, el.innerText.length - 1);
      if (el.innerText.length > 0) {
        subFont(el);
      } else {
        wait(addFont, options.spanTime, el);
      }
    }, options.subTime)
  }

  // 加文字
  function addFont(el) {
    setTimeout(function () {
      // console.log(el.innerText.length);
      el.innerText = options.textArr[_index].substr(0, el.innerText.length + 1);
      if (el.innerText.length < options.textArr[_index].length) {
        addFont(el);
      } else if(options.textArr[++_index]) {
        wait(subFont, options.spanTime, el);
      } else if (options.circulation) {
        _index = 0;
        if (options.reverse) {
          options.textArr.reverse();
          _index = 1;
        }
        wait(subFont, options.spanTime, el);
      } else if(options.endRemoveCursor){
        // removeCursor();
        wait(options.removeCursor, options.spanTime)
      }
    }, options.addTime);
  }

  // 间隔一段时间执行
  function wait(cb, time) {
    var params = Array.prototype.slice.call(arguments, 2);
    // console.log(params);
    setTimeout(function() {
      cb.apply(null, params);
    }, time);
  }

  this.cursor = function cursor(elId, params) {
    var el = document.getElementById(elId);
    // 添加样式
    var cursorStyle = document.createTextNode('div:after{content:"";display:inline-block;width:'+ options.width +'px;height:'+ options.height +'px;vertical-align:bottom;background:' + options.color + ';animation:blink '+ options.blinkTime +'s;animation-iteration-count:infinite;}@keyframes blink{from{opacity:1}to{opacity:0}}');
    var style = document.createElement('style');
    var head = document.getElementsByTagName('head')[0];
    style.appendChild(cursorStyle);
    head.appendChild(style);
    el.innerText = el.innerText.trim(); // 删除空格影响

    options.removeCursor = function () {
      head.removeChild(style);
    }

    if (options.startMode === 'add') {
      wait(addFont, options.initTime, el);
    } else {
      el.innerText = options.textArr[_index++];
      wait(subFont, options.initTime, el);
    }
    // 运行
    // setTimeout(function () {
    //   // 减少文字
    //   subFont(el);
    // }, initTime);
  }
})();
