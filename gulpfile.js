var gulp = require('gulp')
var argv = require('yargs').argv
var changed = require('gulp-changed')
var connect = require('gulp-connect')
var gulpFilter = require('gulp-filter')
var jeditor = require('gulp-json-editor')
var notify = require('gulp-notify')
var gulpif = require('gulp-if')
var uglify = require('gulp-uglify')

var browserify = require('browserify')
var del = require('del')
var exec = require('child_process').exec
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')

var ENV = {
    app: './app',
    dist: './dist',
    tmp: './kango-runtime/src/common',
    kangocli: './kango/kango.py',
    manifest: './app/extension_info.json'
}

var options = {
    dist: false
}

var manifest = require(ENV.manifest)
var browser = argv.safari !== undefined ? 'safari' : 'chrome'

gulp.task('build:contentscript', function () {
    return browserify('./app/content_app.js', { paths: [ ENV.app ], debug: false })
    .transform('babelify', {
        presets: ['es2015'],
        plugins: [
            'transform-async-to-generator',
            'transform-runtime'
        ]
    })
    .transform('browserify-css', {
        autoInject: true
    })
    .transform('hbsfy')
    .bundle()
    .on('error', function (err) {
        console.log(err.message)
        console.log(err.codeFrame)
        this.emit('end')
    })
    .pipe(source('contentscript.js'))
    .pipe(buffer())
    .pipe(gulpif(options.dist, uglify()))
    .pipe(gulp.dest(ENV.tmp))
})

gulp.task('build:backgroundscript', function () {
    return browserify('./app/background_app.js', { paths: [ ENV.app ], debug: true })
    .transform('babelify', {
        presets: ['es2015'],
        plugins: [
            'transform-async-to-generator',
            'transform-runtime'
        ]
    })
    .bundle()
    .on('error', function (err) {
        console.log(err.message)
        console.log(err.codeFrame)
        this.emit('end')
    })
    .pipe(source('backgroundscript.js'))
    .pipe(buffer())
    .pipe(gulpif(options.dist, uglify()))
    .pipe(gulp.dest(ENV.tmp))
})

gulp.task('build:manifest', function () {
    var contentscripts = manifest.content_scripts.filter(function (element) { return /bower_components|res\//.test(element) })
    var backgroundscripts = manifest.background_scripts.filter(function (element) { return /bower_components|res\//.test(element) })

    contentscripts.push('contentscript.js')
    backgroundscripts.push('backgroundscript.js')

    return gulp.src(ENV.app + '/extension_info.json')
    .pipe(jeditor(function (json) {
        json.content_scripts = contentscripts
        json.background_scripts = backgroundscripts
        return json
    }))
    .pipe(gulp.dest(ENV.tmp))
})

gulp.task('copy:staticFiles', function () {
    return gulp.src([
        './icons/**/*',
        './res/defaults/*',
        './ui/**/*'
    ], { cwd: ENV.app, base: ENV.app })
    .pipe(changed(ENV.tmp))
    .pipe(gulp.dest(ENV.tmp))
})

gulp.task('copy:bowerFiles', function () {
    var filter = gulpFilter(function (file) {
        return /bower_components/.test(file.path)
    })

    var allScripts = manifest.content_scripts.concat(manifest.background_scripts)

    return gulp.src(allScripts, { cwd: ENV.app, base: ENV.app })
    .pipe(filter)
    .pipe(changed(ENV.tmp))
    .pipe(gulpif(options.dist, uglify()))
    .pipe(gulp.dest(ENV.tmp))
})

gulp.task('clean:dist', function (cb) {
    return del([ENV.dist], cb)
})

gulp.task('clean:tmp', function (cb) {
    return del([ENV.tmp], cb)
})

gulp.task('kango:build', [
    'build:backgroundscript',
    'build:contentscript',
    'build:manifest',
    'copy:bowerFiles',
    'copy:staticFiles'
], function (cb) {
    exec('python ' + ENV.kangocli + ' build kango-runtime --output-directory ' + ENV.dist, function (err) {
        cb(err)
    })
})

gulp.task('kango:dev', [
    'build:backgroundscript',
    'build:contentscript',
    'build:manifest',
    'copy:bowerFiles',
    'copy:staticFiles'
], function (cb) {
    exec('python ' + ENV.kangocli + ' build kango-runtime --target ' + browser + ' --no-pack --output-directory ' + ENV.dist, function (err) {
        cb(err)
    })
})

gulp.task('connect', function () {
    connect.server({
        root: ENV.app,
        livereload: true
    })
})

gulp.task('watch', function () {
    return gulp.watch(ENV.app + '/**/*', ['reload'])
})

gulp.task('reload', ['kango:dev'], function () {
    return gulp.src(ENV.app + '/**/*')
    .pipe(connect.reload())
    .pipe(notify({
        onLast: true,
        message: 'Build finished'
    }))
})

gulp.task('build', ['clean:dist', 'clean:tmp'], function () {
    options.dist = true
    gulp.start('kango:build')
})

gulp.task('default', ['clean:dist', 'clean:tmp', 'connect'], function () {
    gulp.start('watch')
    gulp.start('kango:dev')
})
