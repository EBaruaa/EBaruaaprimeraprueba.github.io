var {src, dest, watch, parallel} = require('gulp');
// CSS 
var sass = require('gulp-sass')(require('sass'));
var plumber = require('gulp-plumber'); 
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');

// Img 
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var cache = require('gulp-cache');
var avif = require('gulp-avif');

//JS
var terser = require('gulp-terser-js');


function js(done){
    src('js/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
    done();
}

function css(done){
    src('scss/**/*.scss') // Identificar el archivos SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // Compilar el archivo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')) // Almacenar el archivo en el disco duro
    done(); // Callback avisa a gulp cuando llegamos al final
}
function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}
function versionWebp(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}
function versionAvif(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}
function dev(done){
    watch('scss/**/*.scss', css)
    watch('js/*.js', js)
    done();
}
exports.css = css;
exports.imagenes = imagenes;
exports.js = js;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes ,versionWebp, versionAvif, js, dev);