
module.exports = (function() {
    'use strict';

    var debug = require('debug')("partials");
    var defaults = require('defaults');
    var Handlebars = require('handlebars');
    var glob = require('glob');
    var fs = require('fs');
    var path = require('path');

    return function (options) {
        options = defaults(options, {
            directory: 'partials',
            pattern: "**/*.hbs"
        });
        return function (files, metalsmith, done) {
            var parts = glob.sync(metalsmith.path(options.directory) + options.pattern);
            parts.forEach(function(file) {
                var contents = fs.readFileSync(file, 'utf8');
                var id = path.basename(file, path.extname(file));
                debug("registered partial: " + id);
                Handlebars.registerPartial(id, contents);
            });
            done();
        };
    };
})();