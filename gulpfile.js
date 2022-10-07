const { src, dest, watch } = require('gulp')

const rename = require('gulp-rename')
const sync   = require('browser-sync').create()
const pug    = require('gulp-pug')
const sass   = require('gulp-sass')(require('node-sass'))
const prefix = require('gulp-autoprefixer')
const babel  = require('gulp-babel')
const minify = require('gulp-minify')
const cwebp  = require('gulp-cwebp')





const compilePug = () => {

  return src('./dev/pug/*.pug')
  .pipe(pug({pretty: true}))
  .pipe(dest('./public/'))

}



const compileSass = () => {

  return src('./dev/scss/**/*.{scss,sass}')
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(prefix({cascade: false }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(dest('./public/assets/css/'))
  .pipe(sync.stream())

}



const compileJS = () => {

  return src('./dev/js/**/*.js')
  .pipe(babel({presets: ['@babel/preset-env']}))
  .pipe(minify({ext: { min: '.min.js'}}))
  .pipe(dest('./public/assets/js/'))
  .pipe(sync.stream())

}



const convertImages = () => {

  return src('./dev/img/**/*.{jpg,jpeg,png}')
  .pipe(cwebp())
  .pipe(dest('./public/assets/img/'))

}


const copyImages = () => {

  return src('./dev/img/**/*.{svg,gif,webp}')
  .pipe(dest('./public/assets/img/'))

}



const copyConfig = () => {

  return src('./dev/config/*.txt')
  .pipe(dest('./public/'))

}





exports.serve = () => {

  sync.init({server: {baseDir: './public'}})

  watch('./dev/pug/*.pug', compilePug).on('change', sync.reload)
  watch('./dev/scss/**/*.{scss,sass}', compileSass)
  watch('./dev/js/**/*.js', compileJS)

}


exports.default = async () => {

  copyConfig()
  compilePug()
  compileSass()
  compileJS()
  convertImages()
  copyImages()

}


exports.pug  = compilePug
exports.sass = compileSass
exports.js   = compileJS
