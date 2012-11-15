!function($) {
    var Selectpicker = function(element, options, e) {
        if (e ) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.$newElement = null;
        this.selectClass = options.btnStyle || '';
        this.noneSelectedText = options.noneSelectedText || 'None selected';
        this.lengthmax = options.maxlength || 20;
        this.multiple = (typeof this.$element.attr('multiple') !== 'undefined' && this.$element.attr('multiple') !== false);
        this.init();
    };

    Selectpicker.prototype = {

        contructor: Selectpicker,

        init: function (e) {
            this.$element.css('display', 'none');

            var template = this.getTemplate();
            template = this.createLi(template);
            this.$element.after(template);
            this.$newElement = this.$element.next('.bootstrap-select');
            this.$newElement.find('> a').addClass(this.selectClass);
            this.clickListener();
        },

        getTemplate: function() {
            var template =
                "<div class='btn-group bootstrap-select'>" +
                    "<a class='btn dropdown-toggle clearfix' data-toggle='dropdown' href='#''>" +
                        "<span class='filter-option pull-left'>__SELECTED_OPTIONS</span>" +
                        "<span class='caret pull-right'></span>" +
                    "</a>" +
                    "<ul class='dropdown-menu' role='menu'>" +
                        "__ADD_LI" +
                    "</ul>" +
                "</div>";

            return template;
        },

        createLi: function(template) {

            var _li = [];
            var _liHtml = '';
            var _inputAttr = (this.multiple) ? "type='checkbox'" : "type='radio' style='display: none;' name='"+Math.random()*100000+"'";
            var _this = this;
            var checkedAttr;

            this.$element.find('option').each(function(){
                _li.push([$(this).text(), $(this).is(':selected')]);
            });

            if(_li.length > 0) {
                template = template.replace('__SELECTED_OPTIONS', this.createSelectedStr());
                for (var i = 0; i < _li.length; i++) {
                    checkedAttr = (_li[i][1]) ? " checked='checked'" : '';
                    _liHtml += "<li rel=" + i + "><a tabindex='-1' href='#'><label class='checkbox inline'>"+
                    "<input class='ignore' " + _inputAttr + checkedAttr + " />"+_li[i][0]+"</label></a></li>";
                }
            }

            template = template.replace('__ADD_LI', _liHtml);

            return template;
        },

        createSelectedStr: function($select){
            var textToShow,
                selectedLabels = [];
            $select = $select || this.$element;
            $select.find('option[selected]').each(function(){
                 selectedLabels.push($(this).text());
             });
            
            if (selectedLabels.length === 0){
                return this.noneSelectedText;
            }
            textToShow = selectedLabels.join(', ');
            return (textToShow.length > this.lengthmax) ? selectedLabels.length + ' selected' : textToShow;
        },

        clickListener: function() {
            var _this = this;
           
            this.$newElement.find('li').on('click', function(e) {
                e.preventDefault();
               
                var rel = $(this).attr('rel'),
                    $input = $(this).find('input');
                    $picker = $(this).parents('.bootstrap-select'),
                    $select = $picker.prev('select'),
                    $option = $select.find('option').eq(parseInt(rel,10)),
                    selectedBefore = $option.is(':selected');

                if (!_this.multiple){
                    $option.siblings('option').removeAttr('selected');
                    $picker.find('input').removeAttr('checked');
                }

                if (selectedBefore){
                    $input.prop('checked', false).removeAttr('checked');
                    $option.removeAttr('selected');
                }
                else{
                    $input.prop('checked', true);
                    $option.attr('selected', 'selected');
                }

                $picker.find('.filter-option').html(_this.createSelectedStr($select));

                $select.trigger('change');
            });
        },
        update : function(){
           this.$newElement.remove();
           this.init();
        }
    };

    $.fn.selectpicker = function(option, event) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('selectpicker'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('selectpicker', (data = new Selectpicker(this, options, event)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

}(window.jQuery);
