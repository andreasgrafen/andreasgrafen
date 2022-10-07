const { src, dest, watch } = require('gulp')

const rename = require('gulp-rename'),
      sync   = require('browser-sync').create(),
      pug    = require('gulp-pug'),
      sass   = require('gulp-sass')(require('node-sass')),
      prefix = require('gulp-autoprefixer'),
      babel  = require('gulp-babel'),
      minify = require('gulp-minify'),
      cwebp  = require('gulp-cwebp')


const config = {

  source: './dev',
  output: './public',
  assets: `/assets`

}





const compilePug = () => {

  return src(`${config.source}/pug/*.pug`)
  .pipe(pug())
  .pipe(dest(config.output))

}



const compileSass = () => {

  return src(`${config.source}/scss/**/*.{scss,sass}`)
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(prefix({cascade: false }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(dest(`${config.output}/${config.assets}/css/`))
  .pipe(sync.stream())

}



const compileJS = () => {

  return src(`${config.source}/js/**/*.js`)
  .pipe(babel({presets: ['@babel/preset-env']}))
  .pipe(minify({ext: { min: '.min.js'}}))
  .pipe(dest(`${config.output}/${config.assets}/js/`))
  .pipe(sync.stream())

}



const convertImages = () => {

  return src(`${config.source}/img/**/*.{jpg,jpeg,png}`)
  .pipe(cwebp())
  .pipe(dest(`${config.output}/${config.assets}/img/`))

}


const copyImages = () => {

  return src(`${config.source}/img/**/*.{svg,gif,webp}`)
  .pipe(dest(`${config.output}/${config.assets}/img/`))

}



const copyConfig = () => {

  return src(`${config.source}/config/*.txt`)
  .pipe(dest(config.output))

}





exports.serve = () => {

  sync.init({server: {baseDir: config.output}})

  watch(`${config.source}/pug/**/*.pug`, compilePug).on('change', sync.reload)
  watch(`${config.source}/scss/**/*.{scss,sass}`, compileSass)
  watch(`${config.source}/js/**/*.js`, compileJS)

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
