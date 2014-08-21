module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                compress: true,
                sourceMap: 'dest/exam.js.map',
                banner: '/* Nightingale Studio 2014 golovim@gmail.com */\n'
            },
            target: {
                src: 'src/exam.js',
                dest: 'dist/exam.min.js'
            }
        },
        jshint: {
            build: {
                src: 'build/*.js',
                options: {
                    "eqeqeq": true,
                    "curly": true,
                    "eqnull": true,
                    "browser": true,
                    "undef": true,
                    "indent": 4,
                    "latedef": true,
                    "camelcase": true,
                    "maxdepth": 3,
                    "funcscope": true,
                    "notypeof": true,
                    "globals": {
                        $: true,
                        markdown: true
                    }
                }
            },
            dev: {
                src: 'build/*.js',
                options: {
                    "eqeqeq": true,
                    "curly": true,
                    "undef": true,
                    "eqnull": true,
                    "browser": true,
                    "indent": 4,
                    "latedef": true,
                    "camelcase": true,
                    "maxdepth": 3,
                    "funcscope": true,
                    "notypeof": true,
                    "globals": {
                        $: true,
                        markdown: true
                    }
                }
            }
        },
        watch: {
            dev: {
                files: ['src/*.js', 'test/*.js'],
                tasks: ['concat:prebuild', 'jshint:dev', 'concat:build', 'test', 'notify:test']
            }
        },
        clean: {
            target: ['dist']
        },
        karma: {
            dev: {
                configFile: 'karma.conf.js',
                browsers: ['Firefox']
            },
            travis: {
                configFile: 'karma.conf.js',
                browsers: ['Firefox']
            },
            build: {
                configFile: 'karma.conf.js',
                browsers: ['Safari', 'Chrome', 'Firefox']
            }
        },
        connect: {
            server: {
                options: {
                    port: 3333,
                    open: {
                        target: 'http://localhost:3333'
                    }
                }
            }
        },
        notify: {
            test: {
                options: {
                    title: 'Exam.js',
                    message: 'Tests passed!'
                }
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/**/*.info'
            }
        },
        jasmine: {
            exam: {
                src: 'build/**/*.js',
                options: {
                    specs: 'test/*Spec.js',
                    helpers: 'test/*Helper.js'
                }
            }
        },
        concat: {
            prebuild: {
                src: ['src/lexer.js', 'src/parser.js', 'src/translator.js', 'src/exam.js'],
                dest: 'build/exam.js',
            },
            build: {
                src: ['node_modules/markdown/lib/markdown.js', 'src/lexer.js', 'src/parser.js', 'src/translator.js', 'src/exam.js'],
                dest: 'build/exam.js',
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('travis-ci-test', ['concat:prebuild', 'jshint', 'concat:build', 'karma:travis', 'coveralls']);
    grunt.registerTask('default', ['clean', 'concat:prebuild', 'jshint:build', 'concat:build', 'test', 'uglify', 'concat', 'coveralls']);
    grunt.registerTask('dev', ['watch']);
};
