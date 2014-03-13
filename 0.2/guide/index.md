## 综述

WordCount是简单易用的字符长度计算工具，提供了三种计算方式。

PS: 本版本支持[KISSY MINI](http://m.kissyui.com/)。但是绑定的事件默认为`change`，而不是`valuechange`。

* 版本：0.2
* 作者：阿克
* demo：[http://gallery.kissyui.com/wordcount/0.2/demo/index.html](http://gallery.kissyui.com/wordcount/0.2/demo/index.html)

## 快速使用组件

```
    S.use('gallery/wordcount/0.1/index', function (S, WordCount) {
         var wordcount = new WordCount({
            type: "han"
         });

         var result = wordcount.count("aaa");

         console.log(result.count); // output: 2
    })
```
### 使用说明

 支持三种形式

    type=length 不区分中英文，使用原生的String.length方法计算。
    type=byte   区分中英文，中文字符算两个长度，英文和半角符号算一个长度
    type=han    汉字算一个长度，半角符号和英文算半个长度。

```

var counter = new WordCounter({
    type: "han",
    maxSize: 30
});

/**
 * @method bind(bundle, templates);
 */
// 提供一个快速的绑定方法，将input的字数统计结果渲染到指定的元素
counter.bind({
   input: <KISSY Selector || Element>,
   output: <KISSY Selector || Element>,
   // 支持从input上读取size属性。当存在size属性且refresh为true时该配置才有效（refresh＝true），其他情况下都是false。该配置会导致每次计算都从input上读取size。
    refresh: true/false
}, {
    countdown: "当前已输入<em>{count}</em>字,还能输入<em>{over}</em>字",
    countover: "已经超出<em>{over}</em>字"
});

// templates可用的数据包括：count/over/isOver。
// 其中isOver标识是否超过了配置的maxSize。
// count表示当前已经输入的长度
// over有两个含义，取决于isOver。若isOver=true，则over表示超过的长度；若isOver=false，则over表示剩余的长度。实际上是maxSize - count的结果。

// 也可以不绑定DOM，直接调用计算的方法。

// 汉字计算方式。中文算一个长度
counter.hanCount(content);
// 英文算一个长度
counter.byteCount(content);

```

## API说明
