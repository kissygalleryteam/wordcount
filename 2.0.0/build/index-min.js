/*!build time : 2014-04-16 4:13:18 PM*/
KISSY.add("kg/wordcount/2.0.0/index",function(a,b){function c(){this.init.apply(this,arguments)}var d=(b.all,a.config("mini")?"change":"valuechange blur"),e={type:"han",trim:!1,maxSize:30,preventOver:!1,wrapEl:null,inputCls:"J_CountHost",inputEl:null,outputCls:"J_CountBoard",outputEl:null,sizeAttr:"size",refresh:!1,tpl:{countdown:'\u8fd8\u80fd\u8f93\u5165<span class="count-hold"><em class="countdown">{diff}</em></span>\u5b57',countover:'\u5df2\u7ecf\u8d85\u51fa<span class="count-hold"><em  class="countover">{diff}</em></span>\u5b57'}};return a.augment(c,{init:function(b){this.cfg=a.merge(e,b),this.tpl=this.cfg.tpl,this.render()},render:function(b){var c=this,e=a.merge(c.cfg,b),f=a.merge(c.tpl,e.tpl),g=e.sizeAttr,h=1*e.maxSize,i=e.type,j=e.refresh,k=a.one(e.inputEl)||a.one("."+e.inputCls,e.wrapEl),l=a.one(e.outputEl)||a.one("."+e.outputCls,e.wrapEl),m=f.countdown,n=f.countover;return k&&l?(k.on(d,function(){var b=h;j&&(b=parseInt(k.attr(g),10)||h);var d=k.val(),f=c._calculate(d,i,b,e.preventOver),o=f.over?n:m;e.preventOver&&f.over&&f.content&&k.val(f.content),l.html(a.substitute(o,f))}),e.trim&&k.on("change",function(){var b=k.val();k.val(a.trim(b))}),k.fire(d),{refresh:function(){k.fire(d)}}):void 0},hanCount:function(a){return this._calculate(a,"han").length},byteCount:function(a){return this._calculate(a,"byte").length},_calculate:function(b,c,d,e){var f=this.cfg,g="han"==c?2:1,h=!1,i=0,j=0;if(f.trim&&(b=a.trim(b)),d||(d=0),"length"==c)i=b.length,j=Math.min(d,i),h=i>d;else for(var k=0,l=b.length;l>k&&(i+=b.charCodeAt(k)>=0&&b.charCodeAt(k)<=255?1:2,!(d&&!h&&i>d*g&&(h=!0,j=k,e)));k++);"han"==c&&(i=Math.ceil(i/2));var m={maxSize:d,over:h,diff:Math.abs(i-d),pos:j,length:i};return h&&e&&(m.content=b.substring(0,j),m.diff=0,m.length=d),m},count:function(b,c){var d=a.merge(this.cfg,c);return this._calculate(b,d.type,d.maxSize)}}),c},{requires:["node"]});