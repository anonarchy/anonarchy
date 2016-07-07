'use strict'

var babel = require('gulp-babel')
var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var concat = require('gulp-concat')
var del = require('del')
var esLint = require('gulp-eslint')
var file = require('gulp-file')
var glob = require('glob')
var gulp = require('gulp')
var iife = require('gulp-iife')
var jasmine = require('gulp-jasmine')
var pathUtils = require('path')
var source = require('vinyl-source-stream')
var sourceMaps = require('gulp-sourcemaps')
var watch = require('gulp-sane-watch')
var watchify = require('watchify')

var browserifier = FastBrowserifier({
  src: ['.build_tmp/manifest.js'],
  dest: 'dist/public/js',
  outputFilename: 'browser.js'
})

function allTasks () {
  return gulp.series(
    clean,
    compile(),
    test,
    lint,
    writeManifest,
    browserifier.writeBundleWithoutWatching,
    linkServer
  )
}

var writeManifest = manifest({
  outputFilename: '.build_tmp/manifest.js',
  files: [
    '.build_tmp/object/prelude.js',
    '.build_tmp/object/app/browser/**/!(main).js',
    '.build_tmp/object/app/shared/**/*.js',
    '.build_tmp/object/app/browser/main.js'
  ]
})

gulp.task('default', allTasks())

gulp.task('check', gulp.series(compile(), test, lint))

gulp.task('clean', clean)

gulp.task('watch', function () {
  gulp.series(
    clean,
    compile(),
    test,
    lint,
    writeManifest,
    browserifier.writeBundle,
    linkServer
  )(function () {
    var handleFileChange = function (filepath) {
      var whatChanged = 'src/' + filepath
      gulp.series(compile(whatChanged), test, lint)(printDivider)
    }

    watch(['src/**/*.js'], {
      onChange: handleFileChange,
      onAdd: handleFileChange,
      onDelete: function (filepath) {
        gulp.series(deleteObjectFile(filepath), test, lint)(printDivider)
      },
      debounce: 50
    })

    watch(['.build_tmp/object/app/**/*.js'], function () {
      gulp.series(writeManifest, browserifier.writeBundle, linkServer)()
    })
  })
})

function printDivider () {
  var time = new Date().toTimeString().slice(0, 8)
  var message = '==[finished at ' + time + ']'

  console.log(message + Array(80 - message.length).fill('=').join(''))
}

function test () {
  var ofiles = [
    '.build_tmp/object/prelude.js',
    '.build_tmp/object/app/**/!(main).js',
    '.build_tmp/object/spec/**/*.js'
  ]

  return gulp.src(ofiles).pipe(jasmine())
}

function clean () {
  return del('.build_tmp/*')
}

function compile (sources) {
  sources = sources || ['src/**/*.js']

  return function () {
    return gulp.src(sources, { base: 'src' })
      .pipe(prelude())
      .pipe(sourceMaps.init())
        .pipe(compileES2015())
        .pipe(iife())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('.build_tmp/object'))
  }
}

function deleteObjectFile (pathRelativeToSrc) {
  return function () {
    return del('.build_tmp/object/' + pathRelativeToSrc)
  }
}

function linkServer () {
  var ofiles = [
    '.build_tmp/object/prelude.js',
    '.build_tmp/object/app/@(shared|server)/**/!(main).js',
    '.build_tmp/object/app/server/main.js'
  ]

  return gulp.src(ofiles)
    .pipe(sourceMaps.init())
      .pipe(concat('server.js'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('dist/'))
}

function lint () {
  return gulp.src(['src/**/*.js', '*.js'])
    .pipe(esLint())
    .pipe(esLint.format('stylish', process.stdout))
    .pipe(esLint.failAfterError())
}

function compileES2015 () {
  return babel({ presets: ['react'] })
}

function prelude () {
  var contents =
    "var Yavanna = require('@benchristel/yavanna')()\n" +
    "if (typeof window === 'object') window.Yavanna = Yavanna\n" +
    "if (typeof global === 'object') global.Yavanna = Yavanna\n"

  return file('prelude.js', contents)
}

function FastBrowserifier (options) {
  /* see: https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md */

  var src = options.src
  var dest = options.dest
  var filename = options.outputFilename

  var self = {
    writeBundle: writeBundle,
    writeBundleWithoutWatching: writeBundleWithoutWatching
  }

  var browserifier = function () {
    return browserify({
      /* entry point for Browserify; files `require`d in the manifest
       * will be included in the bundle */
      entries: src,
      /* the debug: true option makes browserify generate sourcemaps */
      debug: true,
      cache: {}, packageCache: {} // TODO: are these needed?
    })
  }

  var watch = watchify(browserifier())

  watch.on('log', function (message) {
    console.log(message)
  })

  function writeBundle () {
    return watch.bundle()
      .on('error', function (message) {
        console.log(message)
      })
      .pipe(source(filename))
      .pipe(buffer())
      .pipe(gulp.dest(dest))
  }

  function writeBundleWithoutWatching () {
    return browserifier().bundle()
      .on('error', function (message) {
        console.log(message)
      })
      .pipe(source(filename))
      .pipe(buffer())
      .pipe(gulp.dest(dest))
  }

  return self
}

function manifest (options) {
  var files = options.files
  var outputFilename = options.outputFilename

  return function () {
    var contents = expandGlobs(files)
      .map(pathRelativeToManifest)
      .map(wrapInRequireCall).join('\n')

    return file(pathUtils.basename(outputFilename), contents, { src: true })
      .pipe(gulp.dest(pathUtils.dirname(outputFilename)))
  }

  function expandGlobs (globs) {
    return globs
      .map(function (g) { return glob.sync(g) })
      .reduce(function (a, b) { return a.concat(b) })
  }

  function wrapInRequireCall (path) {
    return "require('./" + path + "')"
  }

  function pathRelativeToManifest (path) {
    return pathUtils.relative(pathUtils.dirname(outputFilename), path)
  }
}
