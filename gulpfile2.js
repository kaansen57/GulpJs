
/* Gulp 4 öncesi */

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const minifyCSS = require("gulp-csso");
const minifyImg = require("gulp-imagemin");
const minifyJS = require("gulp-uglify");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");
const runSequence = require("run-sequence");

gulp.task("browser-sync", () => {
  //browser-sync live-server oluşturmaya yarar , değişimleri görebilmek için tarayıcıyı otomatik olarak canlı bir şekilde reload eder
  browserSync.init({
    server: {
      //server oluştur
      // port:8080,
      baseDir: "dist", // serverı hangi dosya base'inden alacağını belirttik
    },
  });
});

gulp.task("css", () => {
  return gulp
    .src("src/scss/**/*.scss") // scss klasörünün altındaki tüm klasörlerdeki (/**/) scss uzantılı dosyaları baz alır
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(minifyCSS()) //css i minify et
    .pipe(autoprefixer()) // --webkit --moz gibi taraycı uyumululuk eklerini otomatik olarak ekler
    .pipe(concat("app.min.css")) // dosyaları app.min.css dosyasında birleştirme
    .pipe(gulp.dest("dist/css")) // dest fonksiyonu ile outputun nereye yapılacağını belirledik
    .pipe(browserSync.stream()); // en son ise bu değişikliği browsera yansıtıyoruz
});

gulp.task("js", () => {
  return gulp
    .src("src/js/**/*.js")
    .pipe(concat("app.min.js"))
    .pipe(minifyJS())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("html", () => {
  return gulp
    .src("src/**/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("img", () => {
    return gulp.src("src/img/**/*").pipe(minifyImg()).pipe(gulp.dest("dist/img"));
});

gulp.task("delete", () => {
    del(["dist/css", "dist/js", "dist/img", "dist/**/*.html"]);
})

gulp.task("watch", () => { // dosyalardaki değişimleri izler ve ona göre taskları çalıştırır.
  gulp.watch("src/scss/**/*.scss", ["css"]); // scss dosyalarındaki değişikleri algılayınca css taskını çalıştıracak
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch("src/img/**/*", ["img"]);
  gulp.watch("src/**/*.html", ["html"]);
});

gulp.task("default", () => {
  // default adındaki task sadece gulp yazarak çalıştırabiliyoruz ,
  //runSequence parametre olarak ne verdiysek sırasıyla yapar
  runSequence("delete", "html", "css", "js", "img", "browser-sync", "watch");
});