/*
combined files : 

gallery/wordcount/0.1/index

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
KISSY.add('gallery/wordcount/0.1/index',function(S, D, E) {
    var defConfig = {
            // type有三种形式。han表示中文长度。byte表示字符长度。length无视中英文，直接取length结果。
            type: "han", // han | byte | length
            trim: false,
            maxSize: 30
        },
        defBundle = {
            input: null,    // 其内容用于统计字数
            output: null,   // 将统计结果反馈到该元素上。
            sizeAttr: "size",
//            type: "han",
            refresh: false    // 是否总是获取元素上的size属性来作为最大字数限制。
        },
        defTemplates = {
            countdown: '还能输入<span class="count-hold"><em class="countdown">{over}</em></span>字',
            countover: '已经超出<span class="count-hold"><em  class="countover">{over}</em></span>字'
        };

    function WordCounter() {
        this.init.apply(this, arguments);
    }

    S.augment(WordCounter, {
        init: function(config) {

            this.cfg = S.merge(defConfig, config);
        },
        bind: function(bundle, templates) {
            bundle = S.merge(defBundle, bundle);
            templates = S.merge(defTemplates, templates);

            var self = this,
                sizeAttr = bundle.sizeAttr,
                elText = D.get(bundle.input),
                elCount = D.get(bundle.output),
                cfg = this.cfg,
                size = cfg.maxSize,
                type = bundle.type || cfg.type,
                refresh = !!D.attr(elText, sizeAttr) && bundle.refresh,
                tpl_countdown = templates.countdown,
                tpl_countover = templates.countover;

            if(!elText || !elCount) return;

            E.on(elText, 'valuechange', function(ev) {
                if(refresh) {
                    size = D.attr(elText, sizeAttr);
                }

                var content = D.val(elText),
                    result = self.count(content, {
                        type: type,
                        maxSize: size
                    });

                var isOver = result.isOver,
                    template = tpl_countdown;
                if(isOver) {
                    template = tpl_countover;
                }

                D.html(elCount, S.substitute(template, result));
            });

            // 失去焦点的时候才真正对内容trim，否则会导致空格无法输入的问题。
            cfg.trim && E.on(elText, 'blur', function(ev) {
                var text = D.val(elText);
                D.val(elText, S.trim(text));
            });

            // 初始化触发
            E.fire(elText, 'valuechange');

            return {
                refresh: function() {
                    E.fire(elText, 'valuechange');
                }
            };
        },
        /**
         * 计算汉字长度。两个英文算一个长度。
         */
        hanCount: function(text) {
            if(this.cfg.trim) {
                text = S.trim(text);
            }
            return Math.ceil(this.byteCount(text) / 2);
        },
        /**
         * 计算字符长度。中文算两个长度
         */
        byteCount: function(text) {
            if(this.cfg.trim) {
                text = S.trim(text);
            }
            return text.replace(/[^\x00-\xff]/g,"**").length;
        },
        /**
         * 计算长度。通过配置返回对应的长度结果。
         * 汉字长度、字符长度甚至直接取length结果。
         */
        count: function(text, setting) {
            var cfg = this.cfg,
                type = (setting || cfg).type,
                maxSize = (setting || cfg).maxSize;

            if(cfg.trim) {
                text = S.trim(text);
            }

            var result = text.length;

            switch(type) {
                case "han":
                    result = this.hanCount(text);
                    break;
                case "byte":
                    result = this.byteCount(text);
                    break;
                default:
                    break;
            }
            var over = maxSize - result;

            return {
                count: result,
                isOver: over < 0,
                over: Math.abs(over)
            };
        }
    });

    return WordCounter;

}, {
    requires: ['dom', 'event']
});


