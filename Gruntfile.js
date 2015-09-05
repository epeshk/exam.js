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
                tasks: ['clean','jison', 'concat', 'test', 'notify:test']
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
       mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        },
        concat: {
            build: {
                src: ['node_modules/markdown/lib/markdown.js','src/exam-question-manager.js','src/exam.js', 'build/parser.js'],
                dest: 'dist/exam.js',
            }
        },
       jison: {
            my_parser: {
                files: {
                    'build/parser.js': 'src/exam.jison'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jison');

    grunt.registerTask('test', ['build','mochaTest']);
    grunt.registerTask('build', ['clean', 'jison', 'concat', 'mochaTest', 'uglify']);
    grunt.registerTask('dev', ['watch']);
};
