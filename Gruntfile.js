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
					strictImports: true
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
						'src/resources/*.xml',
						'tmp/**.js',
						'tmp/**.css'
					], 'dest': 'www/', 'filter':'isFile'}
				]
			}
		},
		multiresize: {
			ios_icon: {
				src: 'src/resources/icon.png',
				dest: [
					'www/res/icon/ios/icon-57.png',
					'www/res/icon/ios/icon-57-2x.png',
					'www/res/icon/ios/icon-72.png',
					'www/res/icon/ios/icon-72-2x.png'
				],
				destSizes: [
					'57x57', 
					'114x114', 
					'72x72', 
					'177x177'
				]
			},
			ios_screen: {
				src: 'src/resources/screen.png',
				dest: [
					'www/res/screen/ios/screen-ipad-landscape-2x.png',
					'www/res/screen/ios/screen-ipad-landscape.png',
					'www/res/screen/ios/screen-ipad-portrait-2x.png',
					'www/res/screen/ios/screen-ipad-portrait.png',
					'www/res/screen/ios/screen-iphone-landscape-2x.png',
					'www/res/screen/ios/screen-iphone-landscape.png',
					'www/res/screen/ios/screen-iphone-portrait-2x.png',
					'www/res/screen/ios/screen-iphone-portrait-568h-2x.png',
					'www/res/screen/ios/screen-iphone-portrait.png'
				],
				destSizes: [
					'2008x1536', 
					'1024x783', 
					'1536x2008', 
					'768x1004', 
					'960x640',
					'480x320',
					'640x960', 
					'640x1136', 
					'320x480'
				]
			},
			android_icon: {
				src: 'src/resources/icon.png',
				dest: [
					'www/res/icon/android/icon-36-ldpi.png',
					'www/res/icon/android/icon-48-mdpi.png',
					'www/res/icon/android/icon-72-hdpi.png',
					'www/res/icon/android/icon-96-xhdpi.png'
				],
				destSizes: [
					'36x36',
					'48x48',
					'72x72',
					'96x96'
				]
			},
			android_screen: {
				src: 'src/resources/screen.png',
				dest: [
					'www/res/screen/android/screen-hdpi-landscape.png',
					'www/res/screen/android/screen-hdpi-portrait.png',
					'www/res/screen/android/screen-ldpi-landscape.png',
					'www/res/screen/android/screen-ldpi-portrait.png',
					'www/res/screen/android/screen-mdpi-landscape.png',
					'www/res/screen/android/screen-mdpi-portrait.png',
					'www/res/screen/android/screen-xhdpi-landscape.png',
					'www/res/screen/android/screen-xhdpi-portrait.png'
				],
				destSizes: [
					'800x480',
					'480x800',
					'320x200',
					'200x320',
					'480x320',
					'320x480',
					'1280x720',
					'720x1280'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-multiresize');

	grunt.registerTask('default', ['less', 'requirejs', 'concat', 'copy', 'multiresize']);
};