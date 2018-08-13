(function() {
    // 构造函数
    function EasySelect(config) {
        this.EasySelect = {};
        this.trigger = config.trigger;
        this.init();
    }

    EasySelect.prototype = {
        constructor: EasySelect,
        init: function() {
            var _this = this;
            _this.EasySelect = document.querySelector('div.EasySelect');
            _this.trigger = document.querySelector(_this.trigger);
            _this.trigger.addEventListener('click', function() {
                _this.EasySelect.classList.add('EasySelect-show');
            });
            document.querySelector('div.greyLayer').addEventListener('click', function() {
                _this.EasySelect.classList.remove('EasySelect-show');
            })
        }
    }

    // 导出
    if (typeof exports === "object") {
        module.exports = EasySelect;
    } else if (typeof define === "function" && define.and) {
        return EasySelect;
    } else {
        window.EasySelect = EasySelect;
    }
})();