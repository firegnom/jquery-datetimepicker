function zeroFill(number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number + ""; // always return a string
}

function hour(i) {
	if (i == null)
		return jQuery('#' + _id + " #hour").val();
	
	var pi;
	//try to parse input
	pi = parseInt(i);
	//TODO hardcoded value
	if (isNaN(pi) || pi > 23 || pi < 0)
		//TODO hardcoded value
		pi = 12;
	
	jQuery('#' + _id + " #hour").val(zeroFill(pi, 2));
	
}
function min(i) {
	if (i == null)
		return parseInt(jQuery('#' + _id + " #min").val());
	var pi;
	//try to parse input
	pi = parseInt(i);
	//TODO hardcoded value
	if (isNaN(pi) || pi > 59 || pi < 0)
		//TODO hardcoded value
		pi = 0;
	jQuery('#' + _id + " #min").val(zeroFill(pi, 2));
}

// id of element
var _id;
//Selector to find button pane
var _buttonPane;

function _setId(id) {
	_id = id;
	_buttonPane = '#' + _id + '~.ui-dialog-buttonpane'
}

var _n;
jQuery.fn.datetimepicker = function () {
	$this = $(this)
		jQuery.each($this, function (i, n) {
			init_sliders('datetimepicker', n);
		});
	return this
};

function log(i) {
	$('#debug').append(i).append('<br/>')
}

var _mouseover = {
	dialog : false,
	input : false
}

function _create_datetimepicker() {
	var dp = $('<div/>').addClass('ui-custom-datetimepicker').attr('id', "datetimepicker");
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

function init_sliders(id, input) {
	_create_datetimepicker();
	_setId(id);
	
	hour(12);
	min(0);
	
	jQuery('#' + id + ' .datepicker').datepicker();
	//jQuery('.custom-datetimepicker-hour-pane').height(jQuery('.datepicker .ui-datepicker').height())
	
	jQuery('#' + id + " #hour-slider").slider({
		orientation : "vertical",
		range : "min",
		min : 0,
		max : 23,
		value : hour(),
		slide : function (event, ui) {
			hour(ui.value)
		}
	});
	
	jQuery('#' + id + " #min-slider").slider({
		orientation : "vertical",
		range : "min",
		min : 0,
		max : 59,
		value : min(),
		slide : function (event, ui) {
			min(ui.value)
		}
	});
	//join time input fields to sliders
	$('#hour').focusout(function () {
		hour(hour());
		jQuery('#' + id + " #hour-slider").slider('value',hour())
		
	})
	$('#min').focusout(function () {
		min(min());
		jQuery('#' + id + " #min-slider").slider('value',min())
	})
	// double click increase by one both time and hour
	$('#min').dblclick(function () {
		min(parseInt(min())+1)
		jQuery('#' + id + " #min-slider").slider('value',min())
	})
	$('#hour').dblclick(function () {
		hour(parseInt(hour())+1);
		jQuery('#' + id + " #hour-slider").slider('value',hour())
		
	})
	
	
	var dialog = jQuery('#' + id).dialog({
			dialogClass : 'notitle',
			buttons : {
				'Select' : function () {
					alert('done');
					jQuery(this).dialog('close')
				}
			},
			width : jQuery('#' + id + ' .datepicker').width() + jQuery('#' + id + ' .timepicker').width(),
			resizable : false,
			draggable : false,
			autoOpen : false
		});
	
	jQuery(_buttonPane)
	.append(
		'<span class="ui-custom-datetimepicker-datejs-input"><input class="ui-state-default ui-widget ui-widget-content ui-corner-left" ><a title="Show All Items" class="ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-right ui-button-icon" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon ui-icon-refresh"></span><span class="ui-button-text"></span></a></span>')
	
	dialog.parent().mouseenter(function () {
		_mouseover.dialog = true;
	}).mouseleave(function () {
		_mouseover.dialog = false;
	});
	$(input).mouseenter(function () {
		_mouseover.input = true;
	}).mouseleave(function () {
		_mouseover.input = false;
	});
	
	jQuery(document).click(function () {
		if (!_mouseover.dialog && !_mouseover.input)
			dialog.dialog('close');
	});
	
	$(input).click(function () {
		dialog.dialog('open');
		dialog.parent().position({
			my : 'left top',
			at : 'left bottom',
			of : $(input)
		});
	});
	
}