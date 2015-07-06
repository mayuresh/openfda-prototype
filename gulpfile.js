var gulp = require("gulp"),
    GulpDocker = require("gulp-docker"),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    express = require('express'),
    livereload = require('connect-livereload'),
    lrserver = require('tiny-lr')(), //create an instance of the live reload server
    refresh = require('gulp-livereload'),
    concat = require('gulp-concat');

var serverport = 8000,
    livereloadport = 37656;

new GulpDocker(gulp, {});

gulp.task('build', function () {
    //Clean out the existing content
    gulp.src(['dist/*.html', 'dist/css/*.css', 'dist/scripts/*.js', 'dist/public/assets/**/*'], {
            read: false
        })
        .pipe(clean({
            force: true
        }));

    //Get out index html files
    gulp.src(['index*.html'])
        //And add them to the dist folder
        .pipe(gulp.dest('dist/')).pipe(refresh(lrserver));

    //Get the CSS files to the dist folder
    gulp.src(['css/*'])
        .pipe(gulp.dest('dist/css/'));

    //Concatenate the adverse reactions js file
    gulp.src(['scripts/adverseReactionApp/app.js',
              'scripts/adverseReactionApp/reactions/reactions.controller.js'])
        .pipe(concat('adversereaction.js'))
        .pipe(gulp.dest('dist/scripts'));

    // Concatenate the food recall js file
    gulp.src(['scripts/services/openFDASvc.js',
              'scripts/services/FoodEnforcement.js',
              'scripts/services/StateMap.js',
              'scripts/services/main.js'])
        .pipe(concat('foodrecall.js'))
        .pipe(gulp.dest('dist/scripts'));

    // Copy the public css assets
    gulp.src(['bower_components/angular-chart.js/dist/angular-chart.css',
              'bower_components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('dist/public/assets/css/'));

    // Copy the public javascript assets
    gulp.src(['bower_components/angular/angular.min.js',
              'bower_components/zingchart/client/zingchart.min.js',
              'bower_components/zingchart-angularjs/src/zingchart-angularjs.js',
              'bower_components/d3/d3.js'])
        .pipe(gulp.dest('dist/public/assets/scripts/'));

});

gulp.task('watch', function () {
    gulp.watch(['index*.html', 'scripts/**/*.js'], ['build']);
});

//Setup node.js express server
var server = express();
//Use the dist folder as the root for the server
server.use(express.static('./dist'));
//Setup live reload
server.use(livereload({
    port: livereloadport
}));
//Redirect to index2.html for all requests
server.all('/*', function (req, res) {
    res.sendFile('index.html', {
        root: 'dist'
    });
});

gulp.task('serve', function () {
    //start webserver and have it exposed as external IP
    server.listen(serverport, '0.0.0.0');
    process.stdout.write('Started server at port: ' + serverport);
    //Note that we are not calling the watch from here to pick up local changes; but we do that in local serve
});

gulp.task('local-serve', function () {
    //start webserver
    server.listen(serverport);
    //start the tiny livereload server
    lrserver.listen(livereloadport);
    //Run the watch task so that changes are picked up
    gulp.run('watch');
});

gulp.task('default', ['build', 'serve']);
