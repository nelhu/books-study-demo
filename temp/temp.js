(function() {
    function version_compare() (v1, v2) {
        if (typeof v1 !== 'string' || typeof v2 !== 'string') {
            throw TypeError('params expected string');
        }

        var long_version;
        var short_version;
        if (v1.length <= v2.length) {
            long_version = v2;
            short_version = v1;
        } else {
            long_version = v1;
            short_version = v2;
        }

        for (var i = 0,length = v1.length; i < length; i++) {
            if (short_version[i] < long_version[i]) {
                return -1;
            } else if (short_version[i] == long_version[i]) {
                continue;
            } else {
                return 1;
            }
        }
        return 1;
    }

    function version_compare2() (v1, v2) {
        // 判断同上
        for (var i = 0,length = v1.length; i < length; i++) {
            return short_version[i].localeCompare(long_version[i])
        }
        return 1;
    }

    version_compare('1.2.3', '1.2.4');
    version_compare2('1.2.3', '1.2.3.a');
})()