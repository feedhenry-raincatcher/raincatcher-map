'use strict';
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js"]
    },
    mochify: {
      options: {
        reporter: 'spec'
      },
      unit: {
        src: ['test/**/*-spec.js']
      }
    }
  });
  grunt.registerTask('default', ['eslint']);
  grunt.registerTask('test',['mochify:unit']);
};
