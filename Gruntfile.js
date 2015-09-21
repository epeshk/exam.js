module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        mangle: true,
        sourceMap: 'dest/exam.js.map',
        banner: '/* Nightingale Studio 2015 golovim@gmail.com */\n'
      },
      target: {
        src: 'dist/exam.js',
        dest: 'dist/exam.min.js'
      }
    },
    watch: {
      dev: {
        files: ['src/**/*', 'test/**/*js'],
        tasks: ['clean', 'jshint', 'jison', 'concat', 'karma', 'notify:test']
      }
    },
    clean: {
      target: ['dist']
    },
    notify: {
      test: {
        options: {
          title: 'Exam.js',
          message: 'Tests passed!'
        }
      }
    },
    concat: {
      build: {
        src: ['node_modules/markdown/lib/markdown.js', 'src/exam-question-manager.js', 'src/exam-translator.js', 'build/parser.js'],
        dest: 'dist/exam.js',
      }
    },
    jison: {
      my_parser: {
        files: {
          'build/parser.js': 'src/exam.jison'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['src/**/*.js', 'test/**/*.js']
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['build']);
  grunt.registerTask('build', ['clean', 'jshint', 'jison', 'concat', 'karma','uglify']);
  grunt.registerTask('dev', ['watch']);
};

