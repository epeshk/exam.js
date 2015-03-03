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
                src: 'dist/exam.js',
                dest: 'dist/exam.min.js'
            }
        },
        jshint: {
            build: {
                src: 'dist/exam.js',
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
                src: 'dist/exam.js',
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
                files: ['src/*.js', 'test/*.js', 'src/*.coffee'],
                tasks: ['coffee', 'concat:prebuild', 'concat:build', 'test', 'notify:test']
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
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                jUnit: {
                    report: true,
                    savePath: "./build/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['tests/']
        },
        concat: {
            prebuild: {
                src: ['build/lexer.js', 'build/parser.js', 'build/translator.js', 'build/exam.js'],
                dest: 'dist/exam.js',
            },
            build: {
                src: ['node_modules/markdown/lib/markdown.js', 'build/lexer.js', 'build/parser.js', 'build/translator.js', 'build/exam.js'],
                dest: 'dist/exam.js',
            }
        },
        coffee: {
            compile: {
                files: {
                    'build/lexer.js': 'src/lexer.coffee',
                    'build/translator.js': 'src/translator.coffee',
                    'build/parser.js': 'src/parser.coffee',
                    'build/exam.js': 'src/exam.coffee'
                }
            },
        }
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
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['jasmine_node']);
    grunt.registerTask('travis-ci-test', ['concat:prebuild', 'jshint', 'concat:build', 'karma:travis', 'coveralls']);
    grunt.registerTask('default', ['clean', 'coffee', 'concat:prebuild', 'concat:build', 'test', 'uglify', 'concat', 'coveralls']);
    grunt.registerTask('dev', ['watch']);
};
