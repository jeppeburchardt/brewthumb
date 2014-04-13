module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					baseUrl: 'src/scripts',
					mainConfigFile: 'src/scripts/config.js',
					out: 'tmp/<%= pkg.name %>-built.js',
					name: 'app'
				}
			}
		},
		less: {
			styles: {
				options: {
					compress: true
				},
				files: {
					'tmp/brewthumb.css': 'src/styles/brewthumb.less'
				}	
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: [
					'src/scripts/lib/require.js',
					'tmp/<%= pkg.name %>-built.js'
				],
				dest:'tmp/<%= pkg.name %>.js'
			},
			css: {
				src: [
					'src/styles/screen.css'
				],
				dest: 'tmp/<%= pkg.name %>.css'
			}
		},
		watch: {
			files: ['src/**/*.js', 'src/**/*.less', 'src/*.html'],
			tasks: ['less', 'requirejs', 'concat', 'copy']
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

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-multiresize');

	grunt.registerTask('icons', ['multiresize']);
	grunt.registerTask('default', ['less', 'requirejs', 'concat', 'copy']);
};