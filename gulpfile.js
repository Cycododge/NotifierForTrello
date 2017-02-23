//imports
var gulp = require('gulp');
var pump = require('pump');
var concatJS = require('gulp-concat');
var concatCSS = require('gulp-concat-css');
// var minifyCSS = require('gulp-clean-css');
// var minifyJS = require('gulp-uglify');

//file locations
var paths = {
	dev: './src/', //files for development
	dist: './dist/', //files for production
	vendor: './node_modules/' //3rd party files
};
var source = {
	css: [
		paths.vendor + 'bootstrap/dist/css/bootstrap.min.css',
		paths.dev + 'css/cycododge.css',
		paths.dev + 'views/app/app.css'
	],
	js: {
		app: [
			//new app init
			paths.dev + 'views/app/app.js',

			//old app init
			paths.dev + 'js/cycododge.js',

			//services
			// paths.dev + 'services/*.js',

			//components
			paths.dev + '**/component.js'
		],
		vendor: [
			paths.vendor + 'angular/angular.min.js',
			paths.vendor + 'angular-ui-router/release/angular-ui-router.min.js',
			paths.dev + 'js/jquery.js',
			paths.dev + 'js/trello.custom.js',
			paths.dev + 'js/buzz.js'
		]
	},
	forDist: [
		//core files
		paths.dev + 'manifest.json',
		paths.dev + 'popup.html',
		paths.dev + 'background.html',

		//html templates
		paths.dev + '**/template.html',

		//background js
		paths.dev + 'js/background.js',

		//images
		paths.dev + 'img/*.+(svg|png|jpg|gif)',

		//sounds
		paths.dev + 'snd/*.+(mp3)'
	]
};

//public tasks
gulp.task('bundle_dev',['copy_to_dist','concat_app_js','concat_vendor_js','concat_css']);
// gulp.task('bundle_prod',['copy_to_dist','minify_app_js','minify_vendor_js','minify_css']);
gulp.task('watch_dev', watch_dev);

//private tasks
gulp.task('concat_app_js', concat_app_js);
gulp.task('concat_vendor_js', concat_vendor_js);
gulp.task('concat_css', concat_css);
// gulp.task('minify_app_js', ['concat_app_js'], minify_app_js);
// gulp.task('minify_vendor_js', ['concat_vendor_js'], minify_vendor_js);
// gulp.task('minify_css', ['concat_css'], minify_css);
gulp.task('copy_to_dist', copy_to_dist);


//////////////////////// FUNCTIONS ////////////////////////

//tasks to run after initial setup for development
function watch_dev() {
	//re-build the bundles on file changes
	detectChanges();
}

//watch for file changes and re-bundle
function detectChanges(){
	gulp.watch(source.js.app, ['concat_app_js']).on('change', onChange);
	gulp.watch(source.js.vendor, ['concat_vendor_js']).on('change', onChange);
	gulp.watch(source.css, ['concat_css']).on('change', onChange);
	gulp.watch(source.forDist, ['copy_to_dist']).on('change', onChange);

	//log file that changed
	function onChange(change) {
		//split up the path to get the file name
		var splitUpPath = change.path.split('/');

		//log the file detected
		console.log('"' + splitUpPath[splitUpPath.length - 1] + '" was ' + change.type);
	}
}

//merge app js files together
function concat_app_js(cb){
	pump([
		gulp.src(source.js.app),
		concatJS('app.js'),
		gulp.dest(paths.dist + 'bundles/')
	], cb);
}

//merge vendor js files together
function concat_vendor_js(cb){
	pump([
		gulp.src(source.js.vendor),
		concatJS('vendor.js'),
		gulp.dest(paths.dist + 'bundles/')
	], cb);
}

//minify the app js bundle
function minify_app_js(cb){
	pump([
		gulp.src(paths.dist + 'bundles/app.js'),
		minifyJS(),
		gulp.dest(paths.dist + 'bundles/')
	], cb);
}

//minify the vendor js bundle
function minify_vendor_js(cb){
	pump([
		gulp.src(paths.dist + 'bundles/vendor.js'),
		minifyJS(),
		gulp.dest(paths.dist + 'bundles/')
	], cb);
}

//merge css files together
function concat_css(){
	return gulp.src(source.css)
	.pipe(concatCSS('app.css'))
	.pipe(gulp.dest(paths.dist + 'bundles/'));
}

//minify the css bundle
function minify_css() {
	return gulp.src(paths.dist + 'bundles/app.css')
	.pipe(minifyCSS({
		keepSpecialComments: 0
	}))
	.pipe(gulp.dest(paths.dist + 'bundles/'));
}

//copies source files needed for the dist folder
function copy_to_dist() {
	return gulp.src(source.forDist, { base: paths.dev })
	.pipe(gulp.dest(paths.dist));
}
