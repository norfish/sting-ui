/**
 *@Name Qtip
 *@Descripe a jQuery plugin tooltip that change the default popup
 *@user Yongxiang.Li
 *@Date 20131114
 *@base on [tipsy](https://github.com/jaz303/tipsy)
 *
 *@Example
 *Html: <a href="#" id="tip" title="Title is Title">Hover Tip</a> 
 *     OR <a href="#" id="tip" qtip-title="Title is Title">Hover Tip</a>
 *simply: @('el').qtip([options]);
 *@Param options {object}
 *{
 *  className: null, 
 *  delayIn: 0,
 *  delayOut: 0,
 *  fade: false,
 *  fallback: '',
 *  direction: 'b',
 *  html: false,
 *  on: false,
 *  offset: 0,
 *  opacity: 0.8,
 *  title: 'title', //can alse specify the content(string: html or text) 
 *  header: '提示', //default header when used  
 *  trigger: 'hover' 
 *}
 */

(function($) {
    'use strict';

    var version = '0.0.3';

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };
    
    function isElementInDOM(ele) {
      while (ele = ele.parentNode) {
        if (ele == document) return true;
      }
      return false;
    };
    
    // 构造器
    function Qtip(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    };
    
    //私有方法
    Qtip.prototype = {
        show: function() {
            var title = this.getTitle(), 
                header = this.getHeader();
            if (title && this.enabled) {
                var $tip = this.tip();
                
                $tip.find('.qtip-inner')[this.options.html ? 'html' : 'text'](title);
                this.options.header ? $tip.find('.qtip-header')[this.options.html ? 'html' : 'text'](header) : $.noop;
                $tip[0].className = 'qtip'; // reset classname in case of dynamic direction
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
                
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });
                
                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    direction = maybeCall(this.options.direction, this.$element[0]);
                var tp;

                switch (direction.charAt(0)) {
                    case 'b':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 't':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'l':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'r':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (direction.length == 2) {
                    if (direction.charAt(1) == 'r') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                $tip.css(tp).addClass('qtip-' + direction);
                $tip.find('.qtip-arrow')[0].className = 'qtip-arrow qtip-arrow-' + direction.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }
                
                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('qtip-title')) != 'string') {
                $e.attr('qtip-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();

            if (typeof o.title == 'string') {
                title = o.title == 'title' ? $e.attr('qtip-title') : o.title;
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },

        getHeader: function(){
            var header, $e = this.$element, o = this.options;

            if (typeof o.header == 'string') {
                header = o.header == 'header' ? $e.text() : o.header;
            } else if (typeof o.header == 'function') {
                header = o.header.call($e[0]);
            }
            header = ('' + header).replace(/(^\s*|\s*$)/, "");
            return header || o.fallback;

        },
        
        tip: function() {
            var opts = this.options, 
                tmpl = this.tmpl;

            if (!this.$tip) {

                if(this.options.header){
                    this.$tip = $(tmpl.header);
                }else{
                    this.$tip = $(tmpl.simple);
                }

                this.$tip.data('qtip-pointee', this.$element[0]);
            }
            return this.$tip;
        },

        tmpl: {
            simple: '<div class="qtip">'+
                        '<div class="qtip-arrow"></div>'+
                        '<div class="qtip-content">'+
                            '<div class="qtip-inner"></div>'+
                        '</div></div>',

            header: '<div class="qtip">'+
                        '<div class="qtip-arrow"></div>'+
                        '<div class="qtip-content">'+
                            '<div class="qtip-header"></div><div class="qtip-inner">'+
                        '</div></div>'
        },
        
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    // 实例方法
    $.fn.qtip = function(options) {
        
        if (options === true) {
            return this.data('qtip');
        } else if (typeof options == 'string') {
            var qtip = this.data('qtip');
            if (qtip) qtip[options]();
            return this;
        }
        
        options = $.extend({}, $.fn.qtip.defaults, options);
        
        function get(ele) {
            var qtip = $.data(ele, 'qtip');
            if (!qtip) {
                qtip = new Qtip(ele, $.fn.qtip.elementOptions(ele, options));
                $.data(ele, 'qtip', qtip);
            }
            return qtip;
        }
        
        function enter() {
            var qtip = get(this);
            qtip.hoverState = 'in';
            if (options.delayIn == 0) {
                qtip.show();
            } else {
                qtip.fixTitle();
                setTimeout(function() { if (qtip.hoverState == 'in') qtip.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var qtip = get(this);
            qtip.hoverState = 'out';
            if (options.delayOut == 0) {
                qtip.hide();
            } else {
                setTimeout(function() { if (qtip.hoverState == 'out') qtip.hide(); }, options.delayOut);
            }
        };
        
        if (!options.on) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder   = options.on ? 'on' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    //默认配置
    $.fn.qtip.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        direction: 'b',
        html: false,
        on: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        header: '提示', // 是否显示
        trigger: 'hover'
    };
    
    $.fn.qtip.revalidate = function() {
      $('.qtip').each(function() {
        var pointee = $.data(this, 'qtip-pointee');
        if (!pointee || !isElementInDOM(pointee)) {
          $(this).remove();
        }
      });
    };
    
    // 缓存tooltip的位置
    $.fn.qtip.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    
    // 处理tip是否超过边界
    $.fn.qtip.autoBT = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 't' : 'b';
    };
    
    $.fn.qtip.autoRL = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'l' : 'r';
    };
    
})(jQuery);
