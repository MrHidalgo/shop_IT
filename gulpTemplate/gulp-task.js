var gulp                =   require('gulp'),
	_if                 =   require('gulp-if'),
	plumber             =   require('gulp-plumber'),
	prefixer            =   require('gulp-autoprefixer'),
	scss                =   require('gulp-sass'),
	cssmin              =   require('gulp-minify-css'),
    sourcemaps          =   require('gulp-sourcemaps'),
	spritesmith         =   require('gulp.spritesmith'),
	imageMin            =   require('gulp-imagemin'),
	pngComp             =   require('imagemin-pngquant'),
	stripCssComments    =   require('gulp-strip-css-comments'),
	notify              =   require('gulp-notify'),
    args                =   require('yargs').argv,
    cssmin              =   require('gulp-cssmin'),
    jade                =   require('gulp-jade'),
    data                =   require('gulp-data'),
    fs                  =   require('fs'),
    glob                =   require('glob'),
    path                =   require('path'),
    foreach             =   require('gulp-foreach'),
    rename              =   require('gulp-rename'),
    uglify              =   require('gulp-uglify'),
    fixmyjs             =   require("gulp-fixmyjs"),
    prettify            =   require('gulp-prettify'),
    cssbeautify         =   require('cssbeautify');
    YOUR_LOCALS         =   {};


var command             =   require('./gulp-command.js');


function jadeMainTask(taskName) {
    return gulp.task(taskName, function() {
        gulp.src('./src/jade/*.jade')
            .pipe(plumber())
            // .pipe(data( function() {
            //     return JSON.parse(
            //         fs.readFileSync('src/_data/*.json')
            //     );
            // }))
            .pipe(jade(
                {
                    // locals : YOUR_LOCALS,
                    pretty : true
                }
            ))
            .pipe(plumber.stop())
            .pipe(gulp.dest('./dist/'))
            .pipe(
                notify(
                    {
                        message : 'JADE file complete in ... ',
                        onLast  : true
                    })
            )
    })
}


/* Twig Templates */
function getJsonData (file, cb) {
    glob("./src/_data/*.json", {}, function(err, files) {
        var data = {};

        if (files.length) {
            files.forEach(function(fPath){
                var baseName = path.basename(fPath, '.json');
                data[baseName] = JSON.parse(fs.readFileSync(fPath));
            });
        }
        cb(undefined, data);
    });
}
function twigMainTask(taskName) {
    return gulp.task(taskName, function () {
        'use strict';

        var twig = require('gulp-twig');

        return gulp.src('./src/twig/*.twig')
            .pipe(plumber())
            .pipe(data(getJsonData))
            .pipe(
                foreach( function(stream, file) {
                    return stream
                        .pipe(twig(
                            {
                                errorLogToConsole : true
                            }
                        ))
                })
            )
            .pipe(prettify({
                'indent_size': 2
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest('./dist/'))
            .pipe(
                notify(
                    {
                        message : 'TWIG file complete in ... ',
                        onLast  : true
                    })
            )
    });
}

function mainScriptTask(taskName) {

    var src     = './src/js/**.js',
        dist    = './dist/script/';

    return gulp.task(taskName, function () {
        gulp.src(src)
            .pipe(plumber())
            .pipe(fixmyjs(
                {
                    legacy : true
                }
            ))
            .pipe(plumber.stop())
            .pipe(
                gulp.dest(dist)
            )
            .pipe(
                notify(
                    {
                        message : 'SCRIPT file complete in ... ',
                        onLast  : true
                    })
            )
            .pipe(uglify())
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(
                notify(
                    {
                        message : 'SCRIPT file complete in min... ',
                        onLast  : true
                    })
            )
    });
}

/* outputStyle : [expanded, compact, nested, compressed] */
function styleMainTask(taskName) {

    return gulp.task(taskName, function() {
		var sassOptions = {
			errLogToConsole : true,
			outputStyle     : 'expanded',
            sourceComments  : true
		};

		var autoPrefixOptions = {
			browsers: [
				'last 4 versions',
				'> 5%',
				'Firefox ESR'
			]
		};

		var src  = './src/scss/**.scss',
            dest = './dist/css/';


        gulp.src(src)
			.pipe(plumber())
            .pipe(sourcemaps.init(
                {
                    loadMaps: true
                }
            ))
			.pipe(scss(
				sassOptions
			).on('error', scss.logError))
			.pipe(prefixer(
				autoPrefixOptions
			))
			.pipe(plumber.stop())
			.pipe(
				gulp.dest(dest)
			)
            .pipe(
                notify(
                    {
                        message : 'SCSS file complete in ... ',
                        onLast  : true
                    })
            )
            .pipe(stripCssComments())
            .pipe(
                gulp.dest(dest)
            )
            .pipe(
                notify(
                    {
                        message : 'Remove comments in ... ',
                        onLast  : true
                    })
            )
            .pipe(cssmin(
                {
                    showLog : true,
                    compatibility : 'ie7',
                    keepSpecialComments : 1
                }
            ))
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(
                gulp.dest(dest)
            )
            .pipe(
                notify(
                    {
                        message : 'Minify file finish ... ',
                        onLast  : true
                    })
            )
	});
}

function imageSprites(taskName) {

    gulp.task(taskName, function() {

        var src, spImgPath, retinaspImgPath, destImg, destCss;

        src             = './src/icons/*.png';
        spImgPath       = '../img/sprite_it.png';
        retinaspImgPath = '../img/sprite_it@2x.png';
        destImg         = './dist/img/';
        destCss         = './src/scss/_variable/';

        var spriteData = gulp.src(src)
            .pipe(
                notify(
                    {
                        message : 'Sprite build in ... ',
                        onLast  : true
                    }
                ))
            .pipe(spritesmith(
                {
                    imgName         : 'sprite_it.png',
                    imgPath         : spImgPath,
                    retinaImgPath   : retinaspImgPath,
                    cssName         : '_sprite_it.scss',
                    retinaSrcFilter :
                        [
                            './src/icons/*@2x.png'
                        ],
                    retinaImgName   : 'sprite_it@2x.png',
                    algorithm       : 'top-down',
                    algorithmOpts   : {
                        sort : false
                    },
                    padding         : 5,
                    cssVarMap       : function(sprite) {
                        sprite.name = 'sp-' + sprite.name;
                    }
                }
            ));

            spriteData.img.pipe(
                gulp.dest(destImg)
            );

            spriteData.css.pipe(
                gulp.dest(destCss)
            );
    });
}

function imageSpritesRetina(taskName) {

    gulp.task(taskName, function() {

        var src, spImgPath, destImg, destCss;

        src             = './src/icons2x/*.png';
        spImgPath       = '../img/sprite_de-2x.png';
        destImg         = './dist/img/';
        destCss         = './src/scss/_variable/';


        var spriteData = gulp.src(src)
            .pipe(
                notify(
                    {
                        message : 'Sprite retina build in ... ',
                        onLast  : true
                    }
            ))
            .pipe(spritesmith(
                {
                    imgName         : 'sprite_de-2x.png',
                    imgPath         : spImgPath,
                    cssName         : '_sprite_de-2x.scss',
                    cssFormat       : 'scss',
                    algorithm       : 'top-down',
                    algorithmOpts   : {
                        sort : false
                    },
                    padding         : 2,
                    cssVarMap   : function(sprite) {
                        sprite.name = 'sprite-' + sprite.name;
                    }
                }
            ));

        spriteData.img.pipe(
            gulp.dest(destImg)
        );

        spriteData.css.pipe(
            gulp.dest(destCss)
        );
    });
}




module.exports.jadeMainTask         =   jadeMainTask;
module.exports.styleMainTask        =   styleMainTask;
module.exports.mainScriptTask       =   mainScriptTask;
module.exports.imageSprites         =   imageSprites;
module.exports.imageSpritesRetina   =   imageSpritesRetina;
module.exports.twigMainTask         =   twigMainTask;