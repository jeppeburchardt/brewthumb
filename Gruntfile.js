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
					{expand: true, flatten: true, src: [
						'src/index.html',
						'src/resources/*.ico',
						'src/resources/*.png',
						'src/resources/*.xml',
						'tmp/**.js',
						'tmp/**.css'
					], 'dest': 'bin/', 'filter':'isFile'}
				]
			}
		},
		multiresize: {
			ios: {
				src: 'src/resources/appicon.png',
				dest: ['src/resources/appicon60.png', 'src/resources/appicon76.png', 'src/resources/appicon114.png', 'src/resources/appicon152.png'],
				destSizes: ['60x60', '76x76', '114x114', '152x152']
			},
			windowsPhone: {
				src: 'src/resources/appicon.png',
				dest: ['src/resources/appicon70.png', 'src/resources/appicon150.png', 'src/resources/appicon310.png'],
				destSizes: ['70x70', '150x150', '310x310']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-multiresize');

	grunt.registerTask('icons', ['multiresize']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);
};