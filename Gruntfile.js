module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/',
          paths: {
            bacon: '../node_modules/baconjs/dist/Bacon'
          },
          name: 'palace',
          out: 'amd/index.js',
          optimize: 'none'
        }
      }
    },
    livescript: {
      src: {
        expand: true,
        flatten: true,
        src: ['test/*.ls'],
        dest: 'test/',
        ext: '.js'
      }
    },
    mocha_phantomjs: {
      all: ['test-harness.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-livescript');

  //grunt.registerTask('build:cjs', ['transpile:cjs']);
  //grunt.registerTask('test', ['build:cjs', 'mochaTest']);
  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('test', ['build', 'livescript', 'mocha_phantomjs']);
  grunt.registerTask('default', ['test']);
};
