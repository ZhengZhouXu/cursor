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
    blinkTime: 0.8, // 光标闪烁一次的时间，单位/s
    textArr: [],
    startMode: 'sub',
    subTime: 200,
    addTime: 200,
    spanTime: 1500,
    initTime: 1500,
    circulation: true,
    reverse: false,
    endRemoveCursor: true,
    removeCursor: function() {}
  }

/**
 * 减文字
 * @param {dom} el - 要修改的元素.
 */
  function subFont(el) {
    // todo 初始化
    // var subNum = 0; // 已减少文字个数
    // num = num | length;
    // if (num > length) {
    //   num = length
    // } else if (num <= 0) {
    //   // todo 报错
    // }

    // 执行
    (function sub(){
      var length = el.innerText.length;
      setTimeout(function () {
        el.innerText = el.innerText.substr(0, length - 1);
        if (length > 0) {
          sub(el);
        } else {
          wait(addFont, options.spanTime, el);
        }
      }, options.subTime)
    })();
  }

  // text: 111,
  // delete: {
  //   index: 0,
  //   num: 1,
  //   text: '哈哈'
  // }

  // 加文字
  var _addNum = 0; // 已增加的文字个数
  var _backArr = []; // 对象中的退格操作
  var _initBackArr = true; // 是否初始化 退格数组
  function addFont(el) {
    // 初始化
    // var addNum = _addNum;
    var textItem = options.textArr[_index];
    var text = '';
    var backObj = {};

    if (!textItem) return;
    if (typeof textItem === 'string') {
      text = textItem;
    }
    else if(typeof textItem === 'object') {
      text = textItem.text;
    }
    else {
      // todo 报错
      return;
    }

    // 初始化退格数组
    if (_initBackArr) {
      _initBackArr = !_initBackArr;

      if (isArray(textItem.back)) {
        _backArr = Object.assign(_backArr, textItem.back);
      } else if(typeof textItem.back === 'object'){
        _backArr.push(textItem.back);
      }
    }

    // 对退格对象赋值
    if (_backArr.length > 0) {
      backObj = _backArr.shift();
    } else {
      backObj = {};
    }

    (function add() {
      setTimeout(function () {
        // console.log(el.innerText.length);
        if (_addNum === backObj.index) {
          // 进行退格

          wait(backspace, options.spanTime, el, backObj.text, backObj.num);
          return;
        }
        el.innerText += text.substr(_addNum++, 1);

        if (_addNum < text.length) {
          // 增加文字
          add(el);
        } else if(options.textArr[++_index]) {
          // 减文字
          // _addIndex = 0;
          _addNum = 0;
          _initBackArr = true;
          wait(subFont, options.spanTime, el);
        } else if (options.circulation) {
          // 循环
          // _addIndex = 0;
          _addNum = 0;
          _initBackArr = true;
          _index = 0;
          if (options.reverse) {
            options.textArr.reverse();
            _index = 1;
          }
          wait(subFont, options.spanTime, el);
        } else if(options.endRemoveCursor){
          // 结束时消除光标显示
          // _addIndex = 0;
          _addNum = 0;
          _initBackArr = true;
          wait(options.removeCursor, options.spanTime)
        }
      }, options.addTime);
    })();
  }

  /**
   * 退格，（在增加文字时执行）
   * @param {dom} el - 要修改的元素.
   * @param {string} text - 退格后增加的文本.
   * @param {int} num - 退格数目
   */
  function backspace(el, text, num) {
    var backNum = 0; // 当前已退格数目
    var addNum = 0; // 已增加数目
    var textLength = text.length;
    var elTextLength = el.innerText.length;
    num = num | textLength;

    // todo 检查变量

    // 执行
    (function back(){
      setTimeout(function () {
        if (backNum < num) {
          el.innerText = el.innerText.substr(0,elTextLength - ++backNum);
          back();
        } else if(addNum < textLength) {
          // 增加文字
          el.innerText += text.substr(addNum++, 1);
          back();
        } else {
          // 继续执行增加
          wait(addFont, options.spanTime, el);
        }
      }, options.subTime)
    })();
  }

  // 间隔一段时间执行
  function wait(cb, time) {
    var params = Array.prototype.slice.call(arguments, 2);
    // console.log(params);
    setTimeout(function() {
      cb.apply(null, params);
    }, time);
  }

  // 当前对象是否为一个数组
  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  this.cursor = function cursor(elId, params) {
    options = Object.assign({}, options, params);
    console.log(params);
    var el = document.getElementById(elId);
    // 添加样式
    var cursorStyle = document.createTextNode('div:after{content:"";display:inline-block;width:'+ options.width +'px;height:'+ options.height +'px;vertical-align:bottom;background:' + options.color + ';animation:blink '+ options.blinkTime +'s;animation-iteration-count:infinite;margin-left:3px}@keyframes blink{from{opacity:1}to{opacity:0}}');
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
      if(!options.textArr[_index]) return;
      el.innerText = options.textArr[_index++];
      wait(subFont, options.initTime, el);
    }
  }
})();
