module.exports = function(grunt) {

	// set grunt tasks
	grunt.initConfig({

		// load package file
		pkg: grunt.file.readJSON('package.json'),

		// set metadata
		meta: {
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
				files: [
					{ 'dist/css/zlux.min.css': ['src/less/zlux.less'] },
					{ 'dist/css/zlux.uikit.min.css': ['src/less/zlux-uikit.less'] }
				]
			},
			dev: {
				options: {
					cleancss: false
				},
				files: [
					{ 'dist/css/zlux.min.css': ['src/less/zlux.less'] },
					{ 'dist/css/zlux.uikit.min.css': ['src/less/zlux-uikit.less'] }
				]
			}
		},

		// JS tasks
		// ========================================================================
		uglify: {
			dist: {
				files: [
					{ 'dist/js/zlux.min.js': ['dist/js/zlux.js'] },
					{ 'dist/js/addons/datatables.min.js': ['dist/js/addons/datatables.js'] },
					{ 'dist/js/addons/nestable.min.js': ['dist/js/addons/nestable.js'] },
					{ 'dist/js/addons/notify.min.js': ['dist/js/addons/notify.js'] },
					{ 'dist/js/addons/animate.min.js': ['dist/js/addons/animate.js'] }
				]
			}
		},

		// BANNER tasks
		// ========================================================================
		usebanner: {
			dist: {
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
							'**/*.js',
							'!**/uikit/*.js'
						]
					}
				]
			}
		},

		// COPY tasks
		// ========================================================================
		copy: { 

			// copy uikit dist files
			uikit_fonts: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/uikit/dist/fonts',
						src: [
							'*'
						],
						dest: 'dist/fonts'
					}
				]
			},

			uikit_js: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/uikit/dist/js',
						src: [
							'**/*.min.js'
						],
						dest: 'dist/js/uikit'
					}
				]
			},

			svg: {
				files: [
					{
						expand: true,
						cwd: 'src/svg',
						src: [
							'*'
						],
						dest: 'dist/svg'
					}
				]
			},

			addons: {
				files: [
					{
						expand: true,
						cwd: 'src/js/addons',
						src: [
							'*.js'
						],
						dest: 'dist/js/addons'
					}
				]
			}
		},

		// CONCAT tasks
		// ========================================================================
		concat: {
		    dist: {
		        options: {
		            separator: "\n\n"
		        },
		        src: [
		            "src/js/core.js",
		            "src/js/component.js",
		            "src/js/ajax.js",
		            "src/js/modal.js",
		            "src/js/spin.js",
		            "src/js/manager.js",
		            "src/js/manager-items.js",
		        ],
		        dest: "dist/js/zlux.js"
		    }
		},

		// WATCH tasks
		// ========================================================================
		watch: {
		    src: {
		        files: ['src/less/**/*.less'],
		        tasks: ['dev']
		    }
		},

		// CLEAN tasks
		// ========================================================================
		clean: {

			dist: ['dist/*'],

			dist_sources: {
				files: [
					{
						expand: true, 
						cwd: 'dist', 
						src: [
							'**/*.less'
						]
					}
				]
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
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-banner");


	// register tasks
	// ========================================================================
	grunt.registerTask('build', ['copy:uikit']);
	grunt.registerTask('dev', ['less:dev']);
	grunt.registerTask('default', ['clean:dist', 'less:dist', 'concat:dist', 'copy:addons', 'uglify:dist', 'usebanner:dist', 'clean:dist_sources', 'copy:uikit_js', 'copy:uikit_fonts', 'copy:svg']);
	
};