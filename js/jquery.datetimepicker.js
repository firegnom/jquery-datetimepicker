function log(i) {
	$('#debug').append(i).append('<br/>')
}

function DateTimePicker(item, options) {
	this.uuid = new Date().getTime()
		this._input = item;
	this.settings = $.extend(this._defaults, options);
	
	this._mouseover = {
		dialog : false,
		input : false
	}
	
	//Create Date Time Picker html
	this._dialog = this._create_datetimepicker();
	
	//set defaultvalues
	this._hours(this.settings.hours);
	this._min(this.settings.minutes);
	
	//initialize datepicker
	//TODO pass options to datepicker
	this._dialog.find('.datepicker').datepicker();
	
	this._initSliders();
	
	this._initDialog();
	
}

(function ($) {
	$.fn.datetimepicker = function (type, options) {
		var settings;
		$this = $(this)
			$.each($this, function (i, n) {
				if (type == null || typeof(type) == "object") {
					$n = $(n)
						$n.data('datetimepicker', new DateTimePicker($n, type))
				} else if (typeof(type) == "string") {
					switch (type) {
					case 'getDate':
						var a =$n.data('datetimepicker').getDate();
						console.log(a)
						return a;
						break;
					}
				}
			});
		return $this
	};
})(jQuery);

DateTimePicker.prototype._zeroFill = function (number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number + ""; // always return a string
}

DateTimePicker.prototype._submit = function () {
	this._dialog.dialog('close');
	this._input.val(this.getDate());
}

DateTimePicker.prototype._openDialog = function () {
	this._dialog.dialog('open');
	this._dialog.parent().position({
		my : 'left top',
		at : 'left bottom',
		of : $this._input
	});
}

DateTimePicker.prototype._initDialog = function () {
	$this = this
		this._dialog.dialog({
			dialogClass : 'notitle',
			buttons : {
				'Select' : function () {
					$this._submit();
				}
			},
			width : this._dialog.find('.datepicker').width() + this._dialog.find('.timepicker').width(),
			resizable : false,
			draggable : false,
			autoOpen : false
		});
	if (this.settings.use_datejs) {
		this._button_pane = this._dialog.parent().find('.ui-dialog-buttonpane')
			this._button_pane.append(
				'<span class="ui-custom-datetimepicker-datejs-input"><input class="ui-state-default ui-widget ui-widget-content ui-corner-left" ><a title="Show All Items" class="ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-right ui-button-icon"><span class="ui-button-icon-primary ui-icon ui-icon ui-icon-refresh"></span><span class="ui-button-text"></span></a></span>')
			this._button_pane.find('a.ui-button').mouseenter(function () {
				$(this).removeClass('ui-state-default');
				$(this).addClass('ui-state-hover');
			}).mouseleave(function () {
				$(this).removeClass('ui-state-hover');
				$(this).addClass('ui-state-default');
			}).click(function () {
				$this._parseDateJs()
			})
			this._button_pane.find('input').keypress(function (e) {
				if (e.which == 13) {
					$this._parseDateJs()
				}
			});
	}
	
	this._dialog.parent().mouseenter(function () {
		$this._mouseover.dialog = true;
	}).mouseleave(function () {
		$this._mouseover.dialog = false;
	});
	this._input.mouseenter(function () {
		$(this).data('datetimepicker')._mouseover.input = true;
	}).mouseleave(function () {
		$(this).data('datetimepicker')._mouseover.input = false;
	});
	
	jQuery(document).click(function () {
		if (!$this._mouseover.dialog && !$this._mouseover.input)
			$this._dialog.dialog('close');
	});
	
	this._input.click(function () {
		$this = $(this).data('datetimepicker');
		$this._openDialog();
	});
	
}

DateTimePicker.prototype.setHours = function (h) {
	this._hours(h);
	this._dialog.find("#hour-slider").slider('value', h)
};
DateTimePicker.prototype.setMinutes = function (h) {
	this._min(h);
	this._dialog.find("#min-slider").slider('value', h)
};

DateTimePicker.prototype._initSliders = function () {
	$this = this;
	
	this._dialog.find("#hour-slider").slider({
		orientation : "vertical",
		range : "min",
		min : this.settings._minhours,
		max : this.settings._maxhours,
		value : this._hours(),
		slide : function (event, ui) {
			$this._hours(ui.value)
		}
	});
	this._dialog.find("#min-slider").slider({
		orientation : "vertical",
		range : "min",
		min : this.settings._minminutes,
		max : this.settings._maxminutes,
		value : this._min(),
		slide : function (event, ui) {
			$this._min(ui.value)
		}
	});
	
	//join time input fields to sliders
	this._dialog.find('#hour').focusout(function () {
		$this.setHours($this._hours());
	}).focus(function () {
		$(this).select()
	}).dblclick(function () {
		$this.setHours(parseInt($this._hours()) + 1);
	})
	this._dialog.find('#min').focusout(function () {
		$this.setMinutes($this._min());
	}).focus(function () {
		$(this).select()
	})
	.dblclick(function () {
		$this.setMinutes(parseInt($this._min()) + 1);
	});
	
}

DateTimePicker.prototype._hours = function (i) {
	if (i == null)
		return this._dialog.find("#hour").val();
	var pi;
	pi = parseInt(i);
	if (isNaN(pi) || pi > this.settings._maxhours || pi < this.settings._minhours)
		pi = this.settings.hours;
	this._dialog.find("#hour").val(this._zeroFill(pi, 2));
}
DateTimePicker.prototype._min = function (i) {
	if (i == null)
		return parseInt(this._dialog.find("#min").val());
	var pi;
	pi = parseInt(i);
	if (isNaN(pi) || pi > this.settings._maxminutes || pi < this.settings._minminutes)
		pi = this.settings.minutes;
	this._dialog.find("#min").val(this._zeroFill(pi, 2));
}

DateTimePicker.prototype._defaults = {
	hours : 12,
	minutes : 0,
	use_datejs : true,
	_maxminutes : 59,
	_minminutes : 0,
	_maxhours : 23,
	_minhours : 0
};

DateTimePicker.prototype._create_datetimepicker = function () {
	var dp = $('<div/>').addClass('ui-custom-datetimepicker datetimepicker-' + this.uuid).attr('id', "datetimepicker");
	dp.append($('<div/>').addClass('datepicker'));
	dp.append(
		$('<div/>').addClass('timepicker').append(
			$('<div/>').addClass('ui-custom-datetimepicker-hour-pane ui-datepicker-inline ui-datepicker ui-widget  ui-helper-clearfix ui-corner-right').append(
				$('<div/>').addClass('ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all ui-custom-datetimepicker-header').append(
					$('<div/>').addClass('').append(
						$('<input id="hour" type="text" maxlength="2" />').addClass('ui-widget ui-state-default ui-helper-clearfix ui-corner-all')).append(':').append(
						$('<input id="min" type="text" maxlength="2" />').addClass('ui-widget ui-state-default ui-helper-clearfix ui-corner-all')))).append(
				$('<div/>').addClass('sliders-panel').append(
					$('<div/>').append('<div id="hour-slider" />')).append(
					$('<div/>').append('<div id="min-slider" />')))))
	$('body').append(dp);
	return dp;
}

DateTimePicker.prototype._parseDateJs = function () {
	var date = Date.parse(this._button_pane.find('.ui-custom-datetimepicker-datejs-input input').val());
	//TODO validate date
	this.setDateTime(date);
}

DateTimePicker.prototype.setDateTime = function (date) {
	this.setDate(date);
	this.setHours(date.getHours())
	this.setMinutes(date.getMinutes())
}
DateTimePicker.prototype.setDate = function (date) {
	this._dialog.find('.datepicker').datepicker('setDate', date);
}

DateTimePicker.prototype.getDate = function () {
	date = this._dialog.find('.datepicker').datepicker('getDate');
	
	date.setHours(this._hours());
	date.setMinutes(this._min());
	return date;
}
