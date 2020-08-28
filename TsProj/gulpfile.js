var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");


gulp.task("default", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['QuickStart.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .external('csharp')
    .external('puerts')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});