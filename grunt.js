module.exports = function (grunt) {

	grunt.initConfig({
		lint: {
			files: ['overthrow.js']
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				smarttabs: true
			}
		},
		min: {
			dist: {
				src: ['overthrow.js'],
				dest: 'overthrow.min.js'
			}
		}
	});

	grunt.registerTask('default', 'lint min');

};