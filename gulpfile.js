var gulp        = require('gulp');
var path        = require('path');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create(); // Tạo instance mới của browserSync
var reload = browserSync.reload;

gulp.task('fileinclude', function() {
    return gulp.src(["src/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(__dirname, '/dist/')))
})

gulp.task('watch', function () {
    gulp.watch('src/partials/**', gulp.series('fileinclude'));
    gulp.watch('src/*.html', gulp.series('fileinclude')); // Reload khi file .html trong thư mục src thay đổi
});


gulp.task('serve', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'dist/.'
        }
    });

    gulp.watch(['dist/*.html']).on('change', reload); // Reload khi file .html trong thư mục dist thay đổi
    gulp.watch(['dist/assets/**']).on('change', reload);
    gulp.watch(['dist/ts/**']).on('change', reload);
});
gulp.task('start', gulp.parallel('fileinclude', 'watch', 'serve'));
