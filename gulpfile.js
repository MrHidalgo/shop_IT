'use strict';


/* NPM PACKAGE */
var gulp        =   require('gulp'),
    notify      =   require('gulp-notify'),
    args        =   require('yargs').argv,
    browserSync =   require('browser-sync').create(),
    reload      =   browserSync.reload,
	watch       =   require('gulp-watch');


/* OBJECT GULP PATH [module] */
var command     =   require('./gulpTemplate/gulp-command.js'),
	task        =   require('./gulpTemplate/gulp-task.js'),
	config      =   require('./gulpTemplate/gulp-config.js');




task.jadeMainTask(command.buildJade);

task.twigMainTask(command.buildTwig);

task.styleMainTask(command.buildScss);

task.mainScriptTask(command.buildScript);

task.imageSprites(command.sprites);

task.imageSpritesRetina(command.spritesRetina);



/* WATCH FILES FOR RELOAD ---> 'gulp watch'*/
gulp.task(command.watch, function() {

    var srcWatch  = [
        './src/scss/**.scss',
        './src/scss/**/**.scss',
        // './src/jade/**.jade',
        // './src/jade/**/**.jade',
        './src/twig/**.twig',
        './src/twig/**/**.twig',
        './src/_data/**.json',
        './src/js/**.js'
    ];

	watch(srcWatch,
		function() {
			gulp.start(
				command.build
			)
		}
    );
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./dist/",
        online      : true,
        notify      : true,
        port        : 1234,
        logPrefix   : 'FrontEnd Server'
    });
});


{
	gulp.task(command.build,
        config.mainConfig.build.arr
	);
}

{
    gulp.task(command.buildMinify,
        config.mainConfig.buildMin.arr
    );
}