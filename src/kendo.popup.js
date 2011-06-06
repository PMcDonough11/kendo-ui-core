(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        OPEN = "open",
        CLOSE = "close",
        CENTER = "center",
        LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        extend = $.extend,
        proxy = $.proxy,
        Component = ui.Component;

    function align(element, anchor, origin, position) {
        origin = origin.split(" ");
        position = position.split(" ");

        var verticalOrigin = origin[0],
            horizontalOrigin = origin[1],
            verticalPosition = position[0],
            horizontalPosition = position[1],
            anchorOffset = anchor.offset(),
            width = element.outerWidth(),
            height = element.outerHeight(),
            anchorWidth = anchor.outerWidth(),
            anchorHeight = anchor.outerHeight(),
            top = anchorOffset.top,
            left = anchorOffset.left,
            round = Math.round;

        if (verticalOrigin === BOTTOM) {
            top += anchorHeight;
        }

        if (verticalOrigin === CENTER) {
            top += round(anchorHeight / 2);
        }

        if (verticalPosition === BOTTOM) {
            top -= height;
        }

        if (verticalPosition === CENTER) {
            top -= round(height / 2 );
        }

        if (horizontalOrigin === RIGHT) {
            left += anchorWidth;
        }

        if (horizontalOrigin === CENTER) {
            left += round(anchorWidth / 2);
        }

        if (horizontalPosition === RIGHT) {
            left -= width;
        }

        if (horizontalPosition === CENTER) {
            left -= round(width / 2 );
        }

        element.css( {
            top: top,
            left: left
        });
    }

    function contains(container, target) {
        return container === target || $.contains(container, target);
    }
    var Popup = Component.extend({
        init: function(element, options) {
            var that = this;

            Component.fn.init.call(that, element, options);

            that.element.hide().css("position", "absolute").appendTo(document.body);

            options = that.options;

            extend(options.animation.open, {
                complete: function() {
                    that.trigger(OPEN);
                }
            });

            extend(options.animation.close, {
                complete: function() {
                    that.trigger(CLOSE);
                }
            });

            that.bind([OPEN, CLOSE], options);

            $(document.documentElement).mousedown(proxy(that._mousedown, that));

            $(window).bind("resize", function() {
                that._updatePosition();
            });

            if (options.toggleTarget) {
                $(options.toggleTarget).bind(options.toggleEvent, proxy(that.toggle, that));
            }
        },
        options: {
            toggleEvent: "click",
            origin: BOTTOM + " " + LEFT,
            position: TOP + " " + LEFT,
            anchor: "body",
            animation: {
                open: {
                    effects: "fadeIn",
                    show: true
                },
                close: {
                    effects: "fadeOut",
                    hide: true
                }
            }
        },
        open: function() {
            var that = this
                options = that.options;

            if (!that.visible()) {
                that._updatePosition();
                that.element.kendoStop().kendoAnimate(options.animation.open);
            }
        },
        toggle: function() {
            var that = this;

            that[that.visible() ? CLOSE : OPEN]();
        },
        visible: function() {
            return this.element.is(":visible");
        },
        close: function() {
            var that = this;

            if (that.visible()) {
                that.element.kendoStop().kendoAnimate(that.options.animation.close);
            }
        },
        _mousedown: function(e) {
            var that = this,
                container = that.element[0],
                toggleTarget = that.options.toggleTarget,
                target = e.target;

            if (!contains(container, target) && (!toggleTarget || !contains($(toggleTarget)[0], target))) {
                that.close();
            }
        },
        _updatePosition: function() {
            var that = this,
                options = that.options;

            align(that.element, $(options.anchor), options.origin, options.position);
        }
    });

    ui.plugin("Popup", Popup);
})(jQuery);
