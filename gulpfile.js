var gulp = require('gulp'),
	 sass = require('gulp-sass'),
	 browserSync = require('browser-sync'),
	 concat = require('gulp-concat'),
	 uglify = require('gulp-uglify'),
	 cleanCSS = require('gulp-clean-css'),
	 rename = require('gulp-rename'),
	 del = require('del'),
	 imagemin = require('gulp-imagemin'),
	 cache = require('gulp-cache'),
	 autoprefixer = require('gulp-autoprefixer'),
	 notify = require("gulp-notify"),
	 sourcemaps = require('gulp-sourcemaps');


// Скрипты проекта
gulp.task('scripts', function () {
	return gulp.src([
			'app/libs/cookies.js',
			'js/hotels.js',
			'js/hotels-list.js',
			'js/main.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', function () {
	return gulp.src('scss/**/*.+(s+(a|c)ss)')
		.pipe(sass().on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function () {
	gulp.watch('scss/**/*.+(s+(a|c)ss)', ['sass']);
	gulp.watch(['libs/**/*.js', 'js/**/**.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function () {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess'
	]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css'
	]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js'
	]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*'
	]).pipe(gulp.dest('dist/fonts'));

});


gulp.task('removedist', function () {
	return del.sync('dist');
});
gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('default', ['watch']);