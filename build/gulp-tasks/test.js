var gulp       = require('gulp');

gulp.task('test-files', function (argument) {

	var jsonServer = require('json-server');

	var server = jsonServer.create();
	var router = jsonServer.router('./tests/data/files-db.json');

	server.use(jsonServer.defaults);
	server.use(router);
	server.listen(3000);

	console.log('Server deployed in http://localhosts:3000');

});

gulp.task('test-items', function (argument) {

	var jsonServer = require('json-server');

	var server = jsonServer.create();
	var router = jsonServer.router('./tests/data/items-db.json');

	server.use(jsonServer.defaults);
	server.use(router);
	server.listen(3000);

	console.log('Server deployed in http://localhosts:3000');

});