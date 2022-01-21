const { watch, series, src, dest } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const minifyCSS = require("gulp-csso");
const minifyImg = require("gulp-imagemin");
const minifyJS = require("gulp-uglify");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");

function browserSyncc(cb) {
  browserSync.init({
    server: {
      //server oluştur
      baseDir: "dist", // serverı hangi dosya base'inden alacağını belirttik
    },
  });
  cb();
}
function css(cb) {
  src("src/scss/**/*.scss") // scss klasörünün altındaki tüm klasörlerdeki (/**/) scss uzantılı dosyaları baz alır
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(minifyCSS()) //css i minify et
    .pipe(autoprefixer()) // --webkit --moz gibi taraycı uyumululuk eklerini otomatik olarak ekler
    .pipe(concat("app.min.css")) // dosyaları app.min.css dosyasında birleştirme
    .pipe(dest("dist/css")) // dest fonksiyonu ile outputun nereye yapılacağını belirledik
    .pipe(browserSync.stream());
  cb();
}

function js(cb) {
  src("src/js/**/*.js")
    .pipe(concat("app.min.js"))
    .pipe(minifyJS())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
  cb();
}

function html(cb) {
  src("src/**/*.html").pipe(dest("dist")).pipe(browserSync.stream());
  cb();
}

function img(cb) {
  src("src/img/**/*").pipe(minifyImg()).pipe(dest("dist/img"));
  cb();
}

function clean(cb) {
  del(["dist/css", "dist/js", "dist/img", "dist/**/*.html"]);
  cb();
}

function watchies(cb) {
  // dosyalardaki değişimleri izler ve ona göre taskları çalıştırır.
  watch("src/scss/**/*.scss", css); // scss dosyalarındaki değişikleri algılayınca css taskını çalıştıracak
  watch("src/js/**/*.js", js);
  watch("src/img/**/*", img);
  watch("src/**/*.html", html);
  cb();
}

exports.css = css; // gulp css ile css fonk çalıştırılabilir
exports.default = series(clean, html, css, js, img, browserSyncc, watchies);

/* seriesin içindeki fonksiyonları ayrı olarak export etmezsek sadece
   gulp default veya o an neye atandıysa o komut ile senkronize şekilde çalışır.

   yukarıdaki durumda gulp css çalışır ama gulp js çalışmaz çünkü export edilmedi.
*/
