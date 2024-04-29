const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const browserSync = require("browser-sync");
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const htmlBeautify = require("gulp-html-beautify")

function compileSass() {
  return gulp
    .src("./src/assets/sass/*.scss")
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer(),
        cssSorter({
          order: "smacss",
        }),
      ])
    )
    .pipe(mmq())
    .pipe(gulp.dest("../css/"))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("../css/"))
}
// ファイルの変更を監視
function watch() {
  gulp.watch("./src/assets/**/*.scss", gulp.series(compileSass, browserReload));
  gulp.watch("./src/assets/js/**/*.js", gulp.series(minJS, browserReload));
  gulp.watch("./src/assets/image/**/*.js", gulp.series(copyImage, browserReload));
  gulp.watch("../**/*.php", browserReload);
}

// ブラウザの立ち上げ
function browserInit(done) {
  browserSync.init({
    // server: {
    //   baseDir: "./public/"
    // }
    // ローカル開発環境のURLを確認する
    proxy: "http://dev-template.local"
  });
  done();
}

// ブラウザのリロード
function browserReload(done) {
  browserSync.reload();
  done();
}
// JSの圧縮
function minJS() {
  return gulp.src("./src/assets/js/**/*.js")
    .pipe(gulp.dest("../js/"))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("../js/"))
}
// HTMLファイルのフォーマット
function formatHTML() {
  return gulp.src("./src/**/*.html")
    .pipe(htmlBeautify({
      indent_size: 2,
      indent_with_tabs: true,
    }))
    .pipe(gulp.dest("./public"))
}

function copyImage() {
  return gulp.src("./src/assets/image/**/*")
    .pipe(gulp.dest("../image/"))
}

exports.compileSass = compileSass;
exports.watch = watch;
exports.browserInit = browserInit;
exports.dev = gulp.parallel(browserInit, watch);
exports.minJS = minJS;
exports.formatHTML = formatHTML;
exports.build = gulp.parallel(minJS, compileSass, copyImage); 