define(function(require, exports, module){
    'use strict'
    
    var Overlay, Widget;
    
    Widget = require('widget');
    
    Overlay = Widget.extend({
        attrs : {
            delay : 100,
            zIndex : 99,
            width : null,
            height : null,
            trigger : null,
            visible : false,
            triggerType : null
        },
        init : function(){
            var trigger, triggerType;
    
            trigger = this.get('trigger');
            triggerType = this.get('triggerType');
    
            if(typeof trigger === 'string'){
                this.set('trigger', trigger = $(trigger));
            }
    
            if(triggerType){
                this['_on' + capitalize(triggerType)](this);
            }
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
            if(!this.rendered && !val){
                this.element.hide();
                return;
            }
    
            this.element[val ? 'fadeIn' : 'fadeOut']();
        },
        _onClick : function(ctx){
            this.get('trigger').on('click', function(){
                ctx[(ctx._activity = !ctx._activity) ? 'show' : 'hide']();
            });
        },
        _onHover : function(ctx){
            var timer;
    
            this.get('trigger').hover(function(){
                clearTimeout(timer);
                ctx.show();
            }, function(){
                mouseleave();
            });
    
            ctx.delegateEvents({
                'mouseenter' : function(){
                    clearTimeout(timer);
                },
                'mouseleave' : function(){
                    mouseleave();
                }
            });
    
            function mouseleave(){
                timer = setTimeout(function(){
                    ctx.hide();
                }, ctx.get('delay'));
            };
        },
        _onFocus : function(ctx){
            this.get('trigger').on({
                'focus' : function(){
                    ctx.show();
                },
                'blur' : function(){
                    setTimeout(function(){
                        (!ctx._downOnElement) && ctx.hide();
                        ctx._downOnElement = false;
                    }, ctx.get('delay'));
                }
            });
    
            ctx.delegateEvents({
                'mousedown' : function(){
                    ctx._downOnElement = true;
                }
            });
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
    
    function capitalize(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    
    module.exports = Overlay;
});