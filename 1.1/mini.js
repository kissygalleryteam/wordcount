/**
 * @fileoverview 
 * @author 阿克<ake.wgk@taobao.com>
 * @module wordcount
 **/
KISSY.add(function (S, Node, Lang) {
    var $ = Node.all,
        EventTarget = S.Event.Target;
    /**
     *
     * @class Wordcount
     * @constructor
     */
    function Wordcount(config) {

    }

    S.augment(Wordcount, EventTarget, /** @lends Wordcount.prototype*/{

    });

    return Wordcount;

}, {requires:['node', 'lang']});



