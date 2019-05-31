var gulp = require("gulp");
var path = require("path");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");

var alloyDbUi = {
  HERE: "./",
  CSS: "./alloydbui/css/",
  SCSS: "./alloydbui/scss/**/**"
};

var alloyDbWeb = {
  HERE: "./",
  CSS: "./web/frontend/styles/css/",
  SCSS: "./web/frontend/styles/**/*.scss"
};

gulp.task("scss:alloydb", function() {
  return gulp.src(alloyDbUi.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(alloyDbUi.HERE))
    .pipe(gulp.dest(alloyDbUi.CSS));
});

gulp.task("scss:web", function() {
  return gulp.src(alloyDbWeb.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(alloyDbWeb.HERE))
    .pipe(gulp.dest(alloyDbWeb.CSS));
});
