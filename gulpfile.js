var gulp = require('gulp');
var path = require('path');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create(); // Tạo instance mới của browserSync
var reload = browserSync.reload;
var {exec} = require('child_process');
const {rimraf} = require("rimraf");
gulp.task('fileinclude', function () {
    return gulp.src(["src/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(__dirname, '/dist/')));
})
gulp.task('copy-assets', async function () {
    return gulp.src(["src/assets/**", '!**/bundles/**', '!**/fonts/**'])
        .pipe(gulp.dest(path.join(__dirname, '/dist/assets/')));
});
gulp.task('copy-assets-all', function () {
    return gulp.src(["src/assets/**"])
        .pipe(gulp.dest(path.join(__dirname, '/dist/assets/')));
});
gulp.task('watch', function (done) {
    gulp.watch('src/partials/**', gulp.series('fileinclude'));
    gulp.watch('src/*.html', gulp.series('fileinclude')); // Reload khi file .html trong thư mục src thay đổi
    gulp.watch(['src/assets/**', '!src/assets/bundles/**', '!src/assets/fonts/**'], gulp.series('copy-assets'));
    // gulp.watch('ts/src/*.ts', gulp.series('webpack'));
    done();
});
// Task "reload" để khởi động lại trình duyệt
gulp.task('reload', function (done) {
    reload();
    done(); // Gọi done() để thông báo rằng task "reload" đã hoàn thành
});
// Task để xóa thư mục "ts/dist"
gulp.task('clean', function (done) {
    rimraf('dist/ts');
    done();
});
// Task để chạy lệnh webpack
gulp.task('build-ts', gulp.series('clean', function (done) {
    exec('webpack --config ts/webpack.config.prod.js', function (error, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        if (error) {
            done(error);
        } else {
            done();
        }
    });
}));
gulp.task('serve', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'dist/.'
        }
    });
    gulp.watch(['src/**/*.html', 'src/assets/**/*.js',], gulp.series('reload'));
    gulp.watch(['dist/assets/ts/**']).on('change', reload);
});
gulp.task('start', gulp.series('build-ts', 'fileinclude', 'copy-assets-all' , 'watch', 'serve'));
// gulp.task('start', gulp.series('fileinclude', 'copy-assets-all', 'watch', 'serve'));
