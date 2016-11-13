// Generated on 2013-12-25 using generator-angular 0.6.0-rc.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            approot: require('./bower.json').appPath || 'src',
            app: '<%= yeoman.approot %>/app',
            dist: 'target'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['{.tmp,<%= yeoman.app %>}/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.approot %>/assets/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.approot %>/{,*/}*.html', '.tmp/assets/styles/{,*/}*.css',
                    '<%= yeoman.approot %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8080,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            proxies: [
                {
                    context: '/rest',
                    host: 'localhost',
                    port: 3000,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/download',
                    host: 'localhost',
                    port: 3000,
                    https: false,
                    changeOrigin: false
                }
            ],
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= yeoman.approot %>'
                    ],
                    middleware: function (connect, options) {
                        var middlewares = [];

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

                        // Serve static files
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });

                        /* middlewares.push(
                         function(req, res, next) {
                         req.setHeader('Access-Control-Allow-Origin', '*');
                         req.setHeader('Access-Control-Allow-Methods', '*');
                         res.setHeader('Access-Control-Allow-Origin', '*');
                         res.setHeader('Access-Control-Allow-Methods', '*');
                         next();
                         });*/

                        return middlewares;
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp', 'test', '<%= yeoman.approot %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js', '<%= yeoman.app %>/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp', '<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/assets/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/assets/styles/'
                    }
                ]
            }
        },


        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/assets/styles/{,*/}*.css'
//                        '<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//                        '<%= yeoman.dist %>/assets/fonts/*.{eot,svg,ttf,woff}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.approot %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/,**/}*.html'],
            css: ['<%= yeoman.dist %>/assets/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.approot %>/assets/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/assets/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.approot %>/assets/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/assets/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    // Optional configurations that you can uncomment to use
                    // removeCommentsFromCDATA: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.approot %>',
                        src: ['*.html', 'app/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.approot %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}', '.htaccess', 'libraries/**/*', 'assets/images/{,*/}*.{webp}',
                            'assets/fonts/*.{eot,svg,ttf,woff}', 'properties.json'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/assets/images',
                        dest: '<%= yeoman.dist %>/assets/images',
                        src: [
                            'generated/*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.approot %>/libraries/font-awesome/fonts/',
                        src: ['*.*'],
                        dest: '<%= yeoman.dist %>/assets/fonts'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.approot %>/libraries/bootstrap/dist/fonts/',
                        src: ['*.*'],
                        dest: '<%= yeoman.dist %>/assets/fonts'
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.approot %>/assets/styles',
                dest: '.tmp/assets/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles', 'imagemin', 'svgmin', 'htmlmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/assets/styles/main.css': [
        //         '.tmp/assets/styles/{,*/}*.css',
        //         '<%= yeoman.approot %>/assets/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server', 'configureProxies', 'autoprefixer', 'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server', 'concurrent:test', 'autoprefixer', 'connect:test', 'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist', 'useminPrepare', 'concurrent:dist', 'autoprefixer', 'concat', 'ngmin', 'copy:dist',
        'cdnify', 'cssmin', 'uglify', 'rev', 'usemin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
