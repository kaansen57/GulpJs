const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyImg = require('gulp-imagemin');
const minifyJS = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task("test", () => {
  console.log("test");
});