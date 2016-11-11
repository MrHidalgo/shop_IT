var commands    =   require('./gulp-command.js');


var mainConfig = {

	build                       : {
		arr : [
			commands.buildScss,
			// commands.buildJade,
			commands.buildTwig,
			commands.buildScript
		]
	},

    buildMin   : {
        arr : [
            commands.minifyStyle
        ]
    }
};


module.exports.mainConfig = mainConfig;