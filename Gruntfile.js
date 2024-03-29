module.exports = function (grunt) {
  const sass = require('node-sass')

  function stripPrefixForTemplates(filePath) {
    /**
     * Strip '../../public/js/cat_source/templates/'
     * from template identifiers.
     */
    var dirsToStrip = 3
    var strippedPath = filePath
      .split('/')
      .splice(dirsToStrip)
      .join('/')
      .replace('.hbs', '')

    return strippedPath
  }

  grunt.initConfig({
    handlebars: {
      options: {
        namespace: 'MateCat.Templates',
        processPartialName: stripPrefixForTemplates,
        processName: stripPrefixForTemplates,
      },
      all: {
        src: ['static/src/templates/review_improved/segment_buttons.hbs'],
        dest: 'static/build/js/templates.js',
      },
    },
    browserify: {
      components: {
        options: {
          transform: [
            [
              'babelify',
              {
                presets: [
                  '@babel/preset-react',
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: ['defaults', 'not ie 11', 'not ie_mob 11'],
                      },
                    },
                  ],
                ],
              },
            ],
          ],
          browserifyOptions: {
            paths: [__dirname + '/node_modules'],
          },
        },
        src: [
          'static/src/js/db.js',
          'static/src/js/review_improved/review_improved.js',
          'static/src/js/review_improved/review_improved.common_extensions.js',
          'static/src/js/review_improved/review_improved.common_events.js',
          'static/src/js/review_improved/review_improved.translate_extensions.js',
          'static/src/js/review_improved/review_improved.review_extension.js',
          'static/src/js/review_improved/review_improved.review_events.js',
          'static/src/js/components/review_improved/*.js',
          'static/src/js/components/*.js',
        ],
        dest: 'static/build/js/ebay-components.js',
      },
      qaReportsVersions: {
        options: {
          transform: [
            [
              'babelify',
              {
                presets: [
                  '@babel/preset-react',
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: ['defaults', 'not ie 11', 'not ie_mob 11'],
                      },
                    },
                  ],
                ],
              },
            ],
          ],
          browserifyOptions: {
            paths: [__dirname + '/node_modules'],
          },
        },
        src: ['static/src/js/quality_report/review_improved.qa_report.js'],
        dest: 'static/build/js/qa-report-improved.js',
      },
      analyze: {
        options: {
          transform: [
            [
              'babelify',
              {
                presets: [
                  '@babel/preset-react',
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: ['defaults', 'not ie 11', 'not ie_mob 11'],
                      },
                    },
                  ],
                ],
              },
            ],
          ],
          browserifyOptions: {
            paths: [__dirname + '/node_modules'],
          },
        },
        src: [
          'static/src/js/analyze_old.js',
          'static/src/js/common.js',
          'static/src/js/ebay-analyze.js',
        ],
        dest: 'static/build/js/analyze_old.js',
      },
    },
    concat: {
      app: {
        options: {
          sourceMap: false,
        },
        src: [
          'static/src/js/libs/handlebars.runtime-v4.0.5.js',
          'static/build/js/templates.js',
          'static/src/js/libs/lokijs.min.js',
        ],
        dest: 'static/build/js/ebay-lib.js',
      },
    },
    sass: {
      app: {
        options: {
          implementation: sass,
          sourceMap: false,
        },
        src: ['static/src/css/sass/review_improved.scss'],
        dest: 'static/build/css/review_improved.css',
      },
      upload: {
        options: {
          implementation: sass,
          sourceMap: false,
        },
        src: ['static/src/css/sass/ebay-upload.scss'],
        dest: 'static/build/css/ebay-upload.css',
      },
    },
  })

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-handlebars')

  grunt.loadNpmTasks('grunt-sass')

  // Define your tasks here
  grunt.registerTask('default', ['bundle:js'])

  grunt.registerTask('bundle:js', [
    'handlebars',
    'browserify:components',
    'browserify:qaReportsVersions',
    'browserify:analyze',
    'concat',
    'sass',
  ])
}
