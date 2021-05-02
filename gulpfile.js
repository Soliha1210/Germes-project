"use strict"
const {src, dest} = require("gulp")
const gulp = require("gulp")

const browsersync = require('browser-sync').create()
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const rigger = require('gulp-rigger')
const sass = require('gulp-sass')
const stripcsscomments = require('gulp-strip-css-comments')
const uglify = require('gulp-uglify')

var path = {
  build: {
    html: "dist/",
    js: "dist/assets/js/",
    css: "dist/assets/css/",
    font: "dist/assets/fonts/",
    images: "dist/assets/img/"
  },
  src: {
      html: "src/*.html",
      font: "src/assets/fonts/*",
      pug: "src/pug/pages/**/*.pug",
      js: "src/assets/js/*.js",
      css: "src/assets/sass/style.scss",
      images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}"
  },
  watch: {
      html: "src/**/*.html",
      font: "src/assets/fonts/*",
      pug: "src/pug/**/*.pug",
      js: "src/assets/js/**/*.js",
      css: "src/assets/sass/**/*.scss",
      images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}"
  },
  clean: "./dist"
}


function html(){
  return src(path.src.html, {base: 'src/'})
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function browserSync(done){
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000
  });
}

function browserSyncReload(done){
  browsersync.reload();
}

function css(){
  return src(path.src.css, {base: 'src/assets/sass/'})
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cssbeautify())
      .pipe(dest(path.build.css))
      .pipe(cssnano())
      .pipe(stripcsscomments())
      .pipe(rename({
        suffix: ".min",
        extname: ".css"
      }))
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js, {base: './src/assets/js/'})
      .pipe(plumber())
      .pipe(rigger())
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(rename({
          suffix: ".min",
          extname: ".js"
      }))
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream());
}

function images() {
  return src(path.src.images)
      .pipe(imagemin())
      .pipe(dest(path.build.images));
}

function clean() {
  return del(path.clean);
}

function pugg() {
  return src(path.src.pug, {
      base: './src/pug/pages/'
  })
      .pipe(pug({
          pretty: true
      }))
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function font(){
  return src(path.src.font, {
      base: 'src/assets/fonts/'
  })
  .pipe(dest(path.build.font))
  .pipe(browsersync.stream())
}

function watchFiles() {
  gulp.watch([path.watch.pug], pugg);
  gulp.watch([path.watch.font], font);
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, font, pugg, images))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.html = html;
exports.css = css;
exports.js = js;
exports.font = font;
exports.images = images;
exports.clean = clean;
exports.pugg = pugg;
exports.build = build;
exports.watch = watch;
exports.default = watch; 