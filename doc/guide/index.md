## 综述

WordCount是简单易用的字符长度计算工具，提供了三种计算方式。

PS: 本版本支持[KISSY MINI](http://m.kissyui.com/)。但是绑定的事件默认为`change`，而不是`valuechange`。


* 版本：2.0.0
* 作者：阿克
* demo：[http://kg.kissyui.com/wordcount/2.0.0/demo/index.html](http://kg.kissyui.com/wordcount/2.0.0/demo/index.html)


## 快速使用组件

```
    S.use('kg/wordcount/0.1/index', function (S, WordCount) {
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
 * @method bind(cfg);
 */
// 提供一个快速的绑定方法，将input的字数统计结果渲染到指定的元素
counter.render({
   inputEl: <KISSY Selector || Element>,
   outputEl: <KISSY Selector || Element>,
   inputCls: "className",
   outputCls: "className",
   wrapEl: <KISSY Selector || Element>, // 在此元素中查找inputCls和outputCls对应的元素。只取第一个节点。
   // 支持从input上读取size属性。该配置会导致每次计算都从input上读取size。
    refresh: true/false,
    preventOver // 是否对超过长度的内容进行截断处理。
    tpl: {
        countdown: "当前已输入<em>{count}</em>字,还能输入<em>{over}</em>字",
        countover: "已经超出<em>{over}</em>字"
    }
});

// templates可用的数据包括：over/maxSize/diff/length/diff/position。
// 其中over标识是否超过了配置的maxSize。
// length表示当前已经输入的长度
// diff有两个含义，取决于over。若over=true，则diff表示超过的长度；若over=false，则diff表示剩余的长度。实际上是maxSize - length的绝对值。
// 若配置了preventOver，表示对超过最大长度限制的内容会进行截断处理。如果通过render方法来绑定的话，不需要额外做处理；若是单独绑定，通过count方法来计算的话，需要重新设置一下内容。count里面返回的内容包含了content。

// 也可以不绑定DOM，直接调用计算的方法。

// 汉字计算方式。中文算一个长度
counter.hanCount(content);
// 英文算一个长度
counter.byteCount(content);


    具体看demo吧～

```

## API说明
