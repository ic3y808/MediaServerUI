var gulp = require("gulp");
var path = require("path");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");

var alloy = {
  HERE: "./",
  CSS: "./alloy/css/",
  SCSS: "./alloy/scss/**/**"
};

var alloyweb = {
  HERE: "./",
  CSS: "./alloyweb/styles/css/",
  SCSS: "./alloyweb/styles/**/*.scss"
};

gulp.task("scss:alloydb", function() {
  return gulp.src(alloy.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(alloy.HERE))
    .pipe(gulp.dest(alloy.CSS));
});

gulp.task("scss:web", function() {
  return gulp.src(alloyweb.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(alloyweb.HERE))
    .pipe(gulp.dest(alloyweb.CSS));
});
