/*global module:false*/

var childProc = require("child_process");

module.exports = function(grunt) {
  var pkg;

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: pkg = grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - <%= pkg.description %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; Licensed <%= pkg.license %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      main: {
        src: ['src/overthrow-detect.js','src/overthrow-toss.js','src/overthrow-polyfill.js','src/overthrow-init.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      sidescroller: {
        src: ['src/overthrow-detect.js','src/overthrow-toss.js','src/overthrow-polyfill.js','src/overthrow-init.js','extensions/overthrow-sidescroller.js'],
        dest: 'dist/<%= pkg.name %>.sidescroller.js'
      }
    },
    qunit: {
      files: ['test/*.html']
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      main: {
        src: ['src/overthrow-detect.js','src/overthrow-toss.js','src/overthrow-polyfill.js','src/overthrow-init.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      sidescroller: {
        src: ['src/overthrow-detect.js','src/overthrow-toss.js','src/overthrow-polyfill.js','src/overthrow-init.js','extensions/overthrow-sidescroller.js'],
        dest: 'dist/<%= pkg.name %>.sidescroller.min.js'
      },

      sidescrollerExtensions: {
        files: (function() {
          var files = {};
          ["append", "disable-nav", "goto", "skip"].forEach(function( plugin ) {
            files[ "dist/overthrow-sidescroller." + plugin + ".min.js" ] =
              [ "dist/overthrow-sidescroller." + plugin + ".js" ];
          });

          return files;
        })()
      }
    },

		copy: {
			plugins: {
				files: [
					{
						expand: true,
						// NOTE prevent overwritting by only pulling namespaced files
						src: "extensions/*sidescroller.*.js",
						dest: "dist/",
						filter: "isFile",
						flatten: true
					}
				]
			}
		}
  });

  // because the compress plugin is insane
	grunt.task.registerTask( "compress", "compress the dist folder", function() {
		var done = this.async();
		childProc.exec( "tar czf dist-" + pkg.version + ".tar.gz dist", function() {
			done();
		});
	});

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['copy', 'concat', 'uglify']);

};
