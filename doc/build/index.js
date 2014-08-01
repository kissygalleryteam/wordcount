/*
combined files : 

kg/wordcount/2.0.0/index

*/
/**
 * @fileoverview 字符长度计算工具。
 *
 * @author 阿克<ake.wgk@taobao.com>
 *
 * @module wordcount
 *
 * @usage
 *
 *  支持三种形式
 *  type=length 不区分中英文，使用原生的String.length方法计算。
 *  type=byte   区分中英文，中文字符算两个长度，英文和半角符号算一个长度
 *  type=han    汉字算一个长度，半角符号和英文算半个长度。
 *
 *  var counter = new WordCounter({
 *      type: "han",
 *      maxSize: 30
 *  });
 *  // 提供一个快速的绑定方法，将input的字数统计结果渲染到指定的元素
 *  counter.bind({
 *      input: <KISSY Selector || Element>,
 *      output: <KISSY Selector || Element>,
 *      // 支持从input上读取size属性。当存在size属性且refresh为true时该配置才有效（refresh＝true），其他情况下都是false。该配置会导致每次计算都从input上读取size。
 *      refresh: true/false
 *  }, {
 *      countdown: "当前已输入<em>{count}</em>字,还能输入<em>{over}</em>字",
 *      countover: "已经超出<em>{over}</em>字"
 *  });
 *  // templates可用的数据包括：count/over/isOver。
 *  // 其中isOver标识是否超过了配置的maxSize。
 *  // count表示当前已经输入的长度
 *  // over有两个含义，取决于isOver。若isOver=true，则over表示超过的长度；若isOver=false，则over表示剩余的长度。实际上是maxSize - count的结果。
 *
 * // 也可以不绑定DOM，直接调用计算的方法。
 *
 * // 汉字计算方式。中文算一个长度
 * counter.hanCount(content);
 * // 英文算一个长度
 * counter.byteCount(content);
 *
 */
KISSY.add('kg/wordcount/2.0.0/index',function(S, Node) {
    var $ = Node.all;

    // kissy mini不支持valuechange事件。移动端也不需要这么实时。
    var EVT_DETECT = S.config("mini") ? "change" : "valuechange blur";

    var defConfig = {
            // type有三种形式。han表示中文长度。byte表示字符长度。length无视中英文，直接取length结果。
            type: "han", // han | byte | length
            trim: false,
            maxSize: 30,
            preventOver: false,

            wrapEl: null,
            inputCls: 'J_CountHost',
            inputEl: null,
            outputCls: 'J_CountBoard',
            outputEl: null,
            sizeAttr: "size",
            refresh: false,  // 是否总是获取元素上的size属性来作为最大字数限制。
            tpl: {
                countdown: '还能输入<span class="count-hold"><em class="countdown">{diff}</em></span>字',
                countover: '已经超出<span class="count-hold"><em  class="countover">{diff}</em></span>字'
            }
        };

    function WordCount() {
        this.init.apply(this, arguments);
    }

    S.augment(WordCount, {
        init: function(config) {

            this.cfg = S.merge(defConfig, config);
            this.tpl = this.cfg.tpl;

            this.render();

        },
        render: function(config) {

            var self = this,
                cfg = S.merge(self.cfg, config),
                tpl = S.merge(self.tpl, cfg.tpl),
                sizeAttr = cfg.sizeAttr,
                maxSize = cfg.maxSize * 1,
                type = cfg.type,
                refresh = cfg.refresh;

            var $text = S.one(cfg.inputEl) || S.one('.' + cfg.inputCls, cfg.wrapEl),
                $count = S.one(cfg.outputEl) || S.one('.'+cfg.outputCls, cfg.wrapEl),
                tpl_countdown = tpl.countdown,
                tpl_countover = tpl.countover;

            if(!$text || !$count) return;

            $text.on(EVT_DETECT, function(ev) {
                var size = maxSize;

                if(refresh) {
                    size = parseInt($text.attr(sizeAttr), 10) || maxSize;
                }

                var content = $text.val(),
                    result = self._calculate(content, type, size, cfg.preventOver);

                var template = result.over ? tpl_countover : tpl_countdown;

                if(cfg.preventOver && result.over && result.content) {
                    $text.val(result.content);
                }

                $count.html(S.substitute(template, result));
            });

            // 失去焦点的时候才真正对内容trim，否则会导致空格无法输入的问题。
            cfg.trim && $text.on('change', function(ev) {
                var text = $text.val();
                $text.val(S.trim(text));
            });

            // 初始化触发
            $text.fire(EVT_DETECT);

            return {
                refresh: function() {
                    $text.fire(EVT_DETECT);
                }
            };
        },
        /**
         * 计算汉字长度。两个英文算一个长度。
         */
        hanCount: function(text) {
            return this._calculate(text, 'han').length;
        },
        /**
         * 计算字符长度。中文算两个长度
         */
        byteCount: function(text) {
//            return text.replace(/[^\x00-\xff]/g,"**").length;
            return this._calculate(text, 'byte').length;
        },
        _calculate: function(text, type, size, preventOver) {

            var cfg = this.cfg,
                rate = type == "han" ? 2 : 1,
                overIt = false,
                length = 0,
                position = 0;

            if(cfg.trim) {
                text = S.trim(text);
            }

            size || (size = 0);

            // ============================

            if(type == "length") {

                length = text.length;
                position = Math.min(size, length);
                overIt = length > size;

            }else {

                for (var i= 0,len = text.length; i < len; i++) {
                    if (text.charCodeAt(i) >= 0 && text.charCodeAt(i) <= 255) {
                        length += 1;
                    }else {
                        length += 2;
                    }

                    if (size && !overIt &&
                        length > size * rate) {

                        overIt = true;
                        position = i;
                        if(preventOver) {
                            break;
                        }
                    }
                }
            }

            if(type == "han") {
                length = Math.ceil(length / 2);
            }

            var rt = {
                maxSize: size,
                over: overIt,
                diff: Math.abs(length - size),
                pos: position,
                length: length
            };

            if(overIt && preventOver) {
                rt.content = text.substring(0, position);
                rt.diff = 0;
                rt.length = size;
            }

            return rt;
        },
        /**
         * 计算长度。通过配置返回对应的长度结果。
         * 汉字长度、字符长度甚至直接取length结果。
         */
        count: function(text, setting) {
            var cfg = S.merge(this.cfg, setting);

            return this._calculate(text, cfg.type, cfg.maxSize);
        }
    });

    return WordCount;

}, {
    requires: ['node']
});
