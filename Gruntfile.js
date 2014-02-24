module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: [
					'src/scripts/lib/jquery-1.11.0.js',
					'src/scripts/lib/knockout-3.0.0.js',
					'src/scripts/brewthumb.js',
				],
				dest: 'tmp/<%= pkg.name %>.js'
			},
			css: {
				src: [
					'src/styles/screen.css'
				],
				dest: 'tmp/<%= pkg.name %>.css'
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
					'tmp/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
				}
			}
		},
		watch: {
			files: ['src/**.*'],
			tasks: ['jshint', 'concat', 'uglify', 'copy']
		},
		copy: {
			dist: {
				files: [
					{expand: true, flatten: true, src: ['src/index.html', 'tmp/**.js', 'tmp/**.css'], 'dest': 'bin/', 'filter':'isFile'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);
};