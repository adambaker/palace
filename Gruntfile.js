module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dest: {
        src: ['src/palace.js'],
        dest: 'amd/index.js',
        options: {
          standalone: 'palace'
        }
      }
    },
    livescript: {
      src: {
        expand: true,
        flatten: true,
        src: ['test/src/*.ls'],
        dest: 'test/compiled/',
        ext: '.js'
      }
    },
    mocha_phantomjs: {
      all: ['test-harness.html']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-livescript');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('test', ['build', 'livescript', 'mocha_phantomjs']);
  grunt.registerTask('default', ['test']);
};
