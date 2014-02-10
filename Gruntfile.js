module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'src/scripts/lib/jquery-1.11.0.js',
					'src/scripts/lib/knockout-3.0.0.js',
					'src/scripts/brewthumb.js',
				],
				dest: 'bin/scripts/<%= pkg.name %>.js'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/scripts/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					window: true
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'bin/scripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'concat', 'uglify', 'rename']
		},
		rename: {
			moveHtml: {
				src: 'src/index.html',
				dest: 'bin/index.html'
			},
		}
	});

	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'rename']);
};