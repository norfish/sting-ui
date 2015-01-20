/**
 * @desc: radio and checkbox component to 代替浏览器的原生radio和checkbox
 * created by yongxiang.li
 * @2014-12-30
 * @email yongxiang.li@qunar.com
 *
 * Usage:
 * $('input[type="checkbox"]').yocheckbox();
 * $('[name=XXX]').yocheckbox([options]);
 *
 * 对于radio元素，会自动判断其类型，并模拟原生radio
 *
 * you can get the checkbox by $('elem').data('yo-checkbox');
 * and change state by $('elem').data('yo-checkbox').prop('checked', true);
 * 
 */

/**
 * [Checkbox description]
 * @param {[$.elem]}    [需要改变的元素]
 * @param {[object]} options [自定义option] 
 *
 * 目前options 只支持size
 * {size: 'large'} //large, small, ...
 */
var Checkbox = function(elem, options){

	//表单元素
	this.$elem = $(elem);

	//当前表单状态
	this.state = {};

	//options
	this.options = options || {};

	//如果已经渲染则停止
	if( this.$elem.data('rendered') ){
		return;
	}

	//是否已经勾选
	this.state.checked = this.$elem.prop('checked') || false;

	//checkbox dom
	this.$checkbox = null;

	//checkbox的wrapper
	this.$wrap = null;

	//if radio
	if(this.$elem.attr('type') === 'radio'){
		this.radioSelector = 'input[name=' + this.$elem.attr('name') + ']';
	}

	/**************************/

	this.render();

	this.attach();

	this.$elem.data('rendered', true);
	this.$elem.data('yo-checkbox', this);
};


Checkbox.prototype = {

	render: function(){
		var _html = [];
		var extClass = '';

		this.$elem.hide();
		
		//box-size
		if(this.options.size){
			extClass += ' yo-checkbox-' + this.options.size;
		}

		//wrapper
		this.$elem.wrap('<span class="js_yocheck_wrap'+ extClass +'"></span>');
		this.$wrap = this.$elem.parent('.js_yocheck_wrap');

		if(this.state.checked){
			_html.push('<div class="yo-checkbox-checked js_checkbox">');
		} else {
			_html.push('<div class="yo-checkbox js_checkbox">');
		}

		_html.push('<div class="box"></div>');
		_html.push('<i class="checker"></i>');
		_html.push('</div>');

		_html = _html.join('');

		this.$checkbox = $(_html);

		this.$wrap.append(_html);

		this.$checkbox = this.$wrap.find('.js_checkbox');

	},

	attach: function(){
		var self = this;
		var $elem = self.$elem;
		var $checkbox = self.$checkbox;
		var $wrap = self.$wrap;

		$elem.on('change', function(e){
			var isChecked = $(this).prop('checked') || false;
			self.isChecked = isChecked;
			self.toChecked(isChecked);
		});

		$wrap.on('click', '.js_checkbox', function(){

			var isChecked = $elem.prop('checked') || false;
			$elem.prop('checked', !isChecked);
			$elem.trigger('change');

		});

		self.radioSelector && $(document).on('change', this.radioSelector, function(e){

			var $tar = $(e.currentTarget);
			var isChecked = $elem.prop('checked') || false;
			self.state.checked = isChecked;
			self.toChecked(isChecked);
		});
	},

	/**
	 * [toChecked 改变状态]
	 * @param  {[boolean]} checked [description]
	 */
	toChecked: function(toChecked){
		var $checkbox = this.$checkbox;
		var $elem = this.$elem;
		toChecked = !!toChecked;

		if(toChecked){
			$checkbox.addClass('yo-checkbox-checked');
		} else {
			$checkbox.removeClass('yo-checkbox-checked');
		}

		$elem.prop('checked', toChecked);
	},

	//类似原生的prop
	prop: function(key, value){
		var self = this;
		var state = this.state;

		if(arguments.length === 1){
			return state[key];
		} else if(arguments.length === 2){
			state[key] = value;
			if(key === 'checked'){
				self.toChecked(value);
			}
		}
	}
};

$.fn.yocheckbox = function(options){
	var $elems = $(this);
	$.each($elems, function(i, elem){
		new Checkbox(elem, options);
	});
};
