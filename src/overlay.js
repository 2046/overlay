'use strict'

var Overlay, Widget;

Widget = require('widget');

Overlay = Widget.extend({
    attrs : {
        width : null,
        height : null,
        zIndex : 99,
        visible : false
    },
    show : function(){
        if(!this.rendered){
            this.render();
        }

        this.set('visible', true);
        return this;
    },
    hide : function(){
        this.set('visible', false);
        return this;
    },
    destroy : function(){
        erase(this, Overlay.blurOverlays);
        return Overlay.superclass.destroy.call(this);
    },
    _blurHide : function(arr){
        arr = $.makeArray(arr);
        arr.push(this.element);
        this._relativeElement = arr;
        Overlay.blurOverlays.push(this);
    },
    _onRenderWidth : function(val){
        this.element.css('width', val);
    },
    _onRenderHeight : function(val){
        this.element.css('height', val);
    },
    _onRenderZIndex : function(val){
        this.element.css('zIndex', val);
    },
    _onRenderVisible : function(val){
        this.element[val ? 'fadeIn' : 'fadeOut']();
    }
});

Overlay.blurOverlays = [];

$(document).on('click', function(e){
    $(Overlay.blurOverlays).each(function(index, item){
        var index, len, el;

        if(!item || !item.get('visible')){
            return;
        }

        for(index = 0, len = item._relativeElement.length; index < len; index++){
            el = $(item._relativeElement[index])[0];

            if(e.target === el || $.contains(el, e.target)){
                return;
            }
        }

        item.hide();
    });
});

function erase(target, arr){
    var index, len;

    for(index = 0, len = arr.length; index < len; index++){
        if(target === arr[index]){
            arr.splice(index, 1);
            return arr;
        }
    }
};

module.exports = Overlay;