module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //requirejs: {
      //compile: {
        //options: {
          //baseUrl: 'tmp/',
          //name: 'typeclasses',
          //out: 'amd/index.js',
          //optimize: 'none'
        //}
      //}
    //},
    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'tmp/'
        }],
      },
      cjs: {
        type: 'cjs',
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'cjs/'
        }]
      }
    }
    //watch: {
    //}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  //grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build:amd', ['transpile:amd', 'requirejs']);
  grunt.registerTask('build:cjs', ['transpile:cjs']);
};
