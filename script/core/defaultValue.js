define(function() {
    'use strict';

    function defaultValue(a, b) {
        if (a !== undefined && a !== null) {
            return a;
        }

        return b;
    }

    return defaultValue;
});