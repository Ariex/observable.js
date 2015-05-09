var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('default', function() {
    return gulp.src([
            '../lib/jasmine_examples/Player.js',
            '../lib/jasmine_examples/Song.js',
            //'spec/jasmine_examples/PlayerSpec.js',
            'spec/basic-test.js'
        ])
        .pipe(jasmine());
});
