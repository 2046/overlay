define(function(require, exports, module){
    'use strict'

    var Overlay, sinon, expect;

    sinon = require('sinon');
    expect = require('expect');
    Overlay = require('overlay');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Overlay', function(){
        var overlay;

        beforeEach(function(){
            overlay = new Overlay({
                width : 120,
                height : 110,
                zIndex : 90,
                className : 'ui-overlay',
                visible : false,
                style : {
                    color : '#e80',
                    backgroundColor : 'green',
                    paddingLeft : '11px',
                    fontSize : '13px'
                }
            });
            overlay.render();
        });

        afterEach(function(){
            if(overlay && overlay.element){
                overlay.hide();
                overlay.destroy();
            }
        });

        it('基本属性', function(){
            equals(overlay.element.hasClass('ui-overlay'), true);
            equals(overlay.element.css('width'), '120px');
            equals(overlay.element.css('height'), '110px');
            equals(parseInt(overlay.element[0].style.zIndex), 90);
            equals(overlay.get('visible'), false);
            expect(['#e80', 'rgb(238, 136, 0)']).to.contain(overlay.element.css('color'));
            expect(['green', 'rgb(0, 128, 0)']).to.contain(overlay.element.css('backgroundColor'));
            equals(overlay.element.css('padding-left'), '11px');
            equals(overlay.element.css('font-size'), '13px');
        });

        it('默认属性', function(){
            overlay.hide().destroy();
            overlay = new Overlay().render();
            equals(overlay.element[0].className, '');
            equals(overlay.element.height(), 0);
            equals(parseInt(overlay.element[0].style.zIndex), 99);
            equals(overlay.get('visible'), false);
            equals(overlay.get('style'), null);
        });

        it('设置属性', function(){
            overlay.set('style', {
                backgroundColor : 'red'
            });
            overlay.set('width', 300);
            overlay.set('height', 450);
            overlay.set('zIndex', 101);
            overlay.set('className', 'myclass');
            overlay.set('visible', true);

            equals(overlay.element.css('width'), '300px');
            equals(overlay.element.css('height'), '450px');
            equals(parseInt(overlay.element[0].style.zIndex), 101);
            expect(['red', 'rgb(255, 0, 0)']).to.contain(overlay.element.css('backgroundColor'));
            equals(overlay.element.hasClass('myclass'), true);
            equals(overlay.element.is(':hidden'), false);
        });

        it('显示隐藏', function(){
            overlay.show();
            equals(overlay.get('visible'), true);

            overlay.hide();
            equals(overlay.get('visible'), false);
        });

        it('Overlay.blurOverlays', function(){
            overlay.hide().destroy();
            var num = Overlay.blurOverlays.length;

            overlay = new Overlay();
            overlay._blurHide();
            expect(Overlay.blurOverlays.length).to.be(num + 1);
            expect(Overlay.blurOverlays[num]).to.be(overlay);
            overlay.destroy();
            expect(Overlay.blurOverlays.length).to.be(num);
        });

        it('_blurHide', function(){
            overlay.hide().destroy();

            var testPopup = Overlay.extend({
                attrs : {
                    trigger : null
                },
                init : function(){
                    var that = this;
                    $(this.get('trigger')).click(function(){
                        that.show();
                    });
                    this._blurHide(this.get('trigger'));
                }
            });

            overlay = new testPopup({
                trigger : $('<a>点击我</a>').appendTo('body'),
                template : '<div>我是 Overlay</div>'
            });

            overlay.get('trigger').click();
            equals(overlay.get('visible'), true);
            var hide = sinon.spy(overlay, 'hide');
            overlay.set('visible', false);
            $('body').click();
            expect(hide.called).not.to.be.ok();

            overlay.set('visible', true);
            $('body').click();
            expect(hide.callCount).to.be(1);
            overlay.get('trigger').off().remove();
        });
    });
});