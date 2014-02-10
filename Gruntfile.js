module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			files: ['src/index.html']
		},
		jshint: {
			files: ['Gruntfile.js', 'src/scripts/brewthumb.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					window: true
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('test', ['jshint', 'qunit']);

	grunt.registerTask('default', ['jshint', 'qunit']);
};