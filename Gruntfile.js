module.exports = function(grunt) {

	// set grunt tasks
	grunt.initConfig({

		// load package file
		pkg: grunt.file.readJSON('package.json'),

		// set metadata
		meta: {
			path: {
				src: 'src',
				dist: {
					root: 'dist'
				}
			},
			banner: '/* ===================================================\n' +
					' * <%= pkg.name %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * ===================================================\n' +
					' * Copyright (C) JOOlanders SL\n' +
					' * <%= pkg.licenses[0].url %>\n' +
					' * ========================================================== */'
		},

		// LESS tasks
		// ========================================================================
		less: {

			dist: {
				options: {
					cleancss: true
				},
				files: { "dist/zlux.min.css": ["src/less/zlux.less"] }
			},
			dev: {
				options: {
					cleancss: false
				},
				files: { "dist/zlux.min.css": ["src/less/zlux.less"] }
			}
		},

		// JS tasks
		// ========================================================================
		uglify: {
			com: {
				files: { '<%= meta.path.dist %>/zlux.min.js': ['<%= meta.path.dist %>/media/js/admin.js'] }
			}
		},

		// BANNER tasks
		// ========================================================================
		usebanner: {
			com: {
				options: {
					position: 'top',
					banner: '<%= meta.banner %>'
				},
				files: [
					{
						expand: true, 
						cwd: 'dist', 
						src: [
							'**/*.css',
							'**/*.js'
						]
					}
				]
			}
		},

		// WATCH tasks
		// ========================================================================
		watch: {
		    src: {
		        files: ['src/less/**/*.less'],
		        tasks: ['dev']
		    }
		}

	});

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-banner");


	// register tasks
	// ========================================================================
	grunt.registerTask('dev', ['less:dev']);
	grunt.registerTask('default', ['less:dist', 'usebanner']);
	
};