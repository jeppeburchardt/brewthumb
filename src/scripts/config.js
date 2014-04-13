require.config({
	preserveLicenseComments: false,
	paths: {
		'jquery': 'lib/jquery',
		'knockout': 'lib/knockout',
		'brewmath': 'lib/brewmath'
	},
	uglify: {
		max_line_length: 500
	}
});

require('app');