'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var appConfig = {
        dist: 'dist'
    };

    grunt.initConfig({
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: [{
                    expand: false,
                    src: ['js/main.js'],
                    dest: 'dist/angular-notification-banner.min.js',
                    ext: '*.js'
                }]
            }
        }
    });
};
