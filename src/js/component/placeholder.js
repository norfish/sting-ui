/**
 * @desc Placeholder shim for lte IE9
 * @author yongxiang.li@qunar.com
 * @date 2014.11.13
 *
 * Todo
 * 支持密码input的placeholder
 */

var _createElement = (function() {
    if (typeof document.createElement !== 'function') {
        // This is the case in IE7, where the type of createElement is "object".
        // For this reason, we cannot call apply() as Object is not a Function.
        return function(){
            return document.createElement(arguments[0]);
        }
    } else {
        return function(){
            return document.createElement.apply(document, arguments);
        }
    }
})();

function _supportPlaceholder(){
    var inp = _createElement('input');
    //return typeof inp.placeholder !== 'undefined';
    //return ('placeholder' in inp);
    return inp.placeholder !== undefined;
}

var Placeholder = function(elem, msg, ocolor,isPsw){
    this.elem = elem;
    this.msg = msg;
    this.ocolor = ocolor; //原始颜色
    this.isPsw = isPsw || false;
}

Placeholder.prototype = {
    constructor: Placeholder,

    init: function(){

        var self = this,
            elem = $(this.elem),
            msg = this.msg;

        //为了兼容之前的placeholder，以及jvalidate校验
        if(elem.data('placeholder') !== msg){
            elem.data('placeholder', msg);
        }

        //对于支持placeholder的直接返回，不需初始化
        if(_supportPlaceholder()){
            return false;
        }

        self.bindEvents();

        self.onShow();
    },

    showPH: function(){
        $(this.elem).val(this.msg)
            .css('color', '#aaa');
    },

    onShow: function(){
        if( this._shouldPlace() ){
            this.showPH();
        }
    },

    onHide: function(){
        if( this._shoulClean() ){
            this.hidePH();
        }
    },

    hidePH: function(){
        $(this.elem).val('')
            .css('color', this.ocolor);
    },

    bindEvents: function(){
        var self = this,
            $elem = $(self.elem);

        $elem.on('focus', function(){
            self.onHide();
        });

        $elem.on('blur', function(){
            self.onShow();
        });
    },

    _shouldPlace: function(){
        return !$(this.elem).val().length;
    },

    _shouldClean: function(){
        return $(this.elem).attr('placeholder') === $(this.elem).val();
    }
};


$.fn.placeholder = function(){
    var elems = this;

    $.each(elems, function(i, elem){
        var msg = $(elem).attr('placeholder') || '',
            ocolor = $(elem).css('color') || '#000',
            isPsw = ($(elem).attr('type') === 'password');

        var ph = new Placeholder(elem, msg, ocolor, isPsw);
        ph.init();
    });
};