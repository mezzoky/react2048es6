var browserify = require('browserify');
var watchify = require('watchify');
var gulp = require('gulp');
var babelify = require('babelify');
var uglify =require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

var dist = './dist';


gulp.task('wjs', function() {
    var b = browserify({
        entries: ['./src/app.js'],
        cache: {},
        packageCache: {},
        plugin: [watchify]
    });

    b.on('update', bundle);
    bundle();

    function bundle() {
        var startTime = Date.now();
        console.log('Updating the ' + dist);
        b.transform(babelify, {
            presets: ['react', 'es2015']
        })
        .bundle()
        .pipe(source('bundle.js'))
        // .pipe(buffer())
        // .pipe(uglify({
        //     mangle: true,
        //     compress: {
        //         sequences: true,
        //         dead_code: true,
        //         conditionals: true,
        //         booleans: true,
        //         unused: true,
        //         if_return: true,
        //         join_vars: true,
        //         drop_console: true
        //     },
        //     outSourceMap: true,
        //     basePath: 'dist',
        //     sourceRoot: '/'
        // }))
        .pipe(gulp.dest(dist));
        console.log('Finished in ', (Date.now() - startTime) + 'ms');
    }
});

var styles = './src/*.scss'

gulp.task('css', function () {
  return gulp.src(styles)
    .pipe(sass())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'ie 7'))
    .pipe(gulp.dest(dist));
});

gulp.task('wcss', function() {
    gulp.watch(styles, ['css']);
})

gulp.task('default', ['wjs', 'wcss']);
