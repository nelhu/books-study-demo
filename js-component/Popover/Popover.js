(function() {
    function Popover(config) {
        this.identifier = config.identifier;
        this.init();
    }

    Popover.prototype = {
        constructor: Popover,
        init: function() {
            var _this = this;
            _this.trigger = document.querySelector(_this.identifier);
            _this.panel = 'panel';
            _this.trigger.addEventListener('click', function() {
                _this.trigger.classList.toggle("popover-show");
            });
        }
    }

    // 导出
    if (typeof exports === "object") {
        module.exports = Popover;
    } else if (typeof define === "function" && define.and) {
        return Popover;
    } else {
        window.Popover = Popover;
    }
})();