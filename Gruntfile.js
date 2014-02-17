module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dest: {
        src: ['compiled/palace.js'],
        dest: 'palace.js',
        options: {
          standalone: 'palace'
        }
      }
    },
    livescript: {
      test: {
        expand: true,
        flatten: true,
        src: ['test/src/*.ls'],
        dest: 'test/compiled/',
        ext: '.js'
      },
      src: {
        expand: true,
        flatten: true,
        src: ['src/*.ls'],
        dest: 'compiled/',
        ext: '.js'
      }
    },
    mocha_phantomjs: {
      all: ['test-harness.html']
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
        pushTo: 'origin'
      }
    },
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-livescript');

  grunt.registerTask('build', ['livescript:src', 'browserify']);
  grunt.registerTask('test', ['build', 'livescript:test', 'mocha_phantomjs']);
  grunt.registerTask('default', ['test']);
};
