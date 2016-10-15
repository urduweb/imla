var autoprefixer = require('autoprefixer');
var collections = require('metalsmith-collections');
var cssimport = require('postcss-import');
var cssclean = require('postcss-clean');
var attrs = require('markdown-it-attrs');
var headings = require('metalsmith-headings');
var headingsAnchors = require('markdown-it-anchor');
var gulp = require('gulp');
var layouts = require('metalsmith-layouts');
var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdownit');
var permalinks = require('metalsmith-permalinks');
var postcss = require('gulp-postcss');
var rootpath = require('metalsmith-rootpath');

const SRC = './src';
const SRC_CONTENT = SRC + '/content';
const SRC_ASSETS = SRC + '/assets';
const DEST = './docs';
const DEST_ASSETS = DEST + '/assets';

gulp.task('metalsmith', function () {
    var md = markdown({
        breaks: true,
        typographer: true,
        quotes: '”“’‘'
    });
    md.use(attrs)
      .use(headingsAnchors, {
        level: 2,
        permalink: false,
        slugify: function(s) {
            return s.replace(/\s+/g, '-')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '')
                    .replace(/[^آاأبپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوؤہۂۃھءئیےۓ-]/g, '');
        }
      });
    
    metalsmith(__dirname)
        .clean(false)
        .source(SRC_CONTENT)
        .destination(DEST)
        .use(collections({
            chapters: {
                sortBy: sorter([
                    'مقدّمہ طبعِ ثانی',
                    'مقدّمہ طبعِ اوّل',
                    'الف',
                    'الف ممدودہ',
                    'تنوین',
                    'ت، ۃ',
                    'ت، ط',
                    'ذ، ز، ژ',
                    'ث، س، ص',
                    'نون اور نون غُنّہ',
                    'واؤ',
                    'ہائے خفی',
                    'ہائے مخلوط',
                    'ہمزہ',
                    'اعداد',
                    'لفظوں میں فاصلہ اور لفظوں کو ملا کر لکھنا'
                ])
            }
        }))
        .use(md)
        .use(headings('h2'))
        .use(permalinks())
        .use(rootpath())
        .use(layouts({
            'engine': 'handlebars',
            'directory': SRC + '/layouts',
            'partials': SRC + '/partials',
            'default': 'chapter.html'
        }))
        .build(function(err, files) {
            if (err) { throw err; }
        });
});

gulp.task('fonts', function() {
    return gulp.src(SRC_ASSETS + '/type/**/*')
        .pipe(gulp.dest(DEST_ASSETS + '/type'));
});

gulp.task('css', function() {
    var processors = [
        cssimport(),
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssclean()
    ];
    
    return gulp.src(SRC_ASSETS + '/css/style.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(DEST_ASSETS + '/css'));
});

gulp.task('default', ['css', 'fonts', 'metalsmith']);


/**
 * Generate a custom sort method for given starting `order`. After the given
 * order, it will ignore casing and put periods last. So for example a call of:
 *
 *   sorter('Overview');
 *
 * That is passed:
 *
 *   - Analytics.js
 *   - iOS
 *   - Overview
 *   - Ruby
 *   - .NET
 *
 * Would guarantee that 'Overview' ends up first, with the casing in 'iOS'
 * ignored so that it falls in the normal alphabetical order, and puts '.NET'
 * last since it starts with a period.
 *
 * @param {Array} order
 * @return {Function}
 *
 * Taken from: https://gist.github.com/lambtron/c8945d3abd11c783eb67
 *
 */

function sorter(order) {
  order = order || [];

  return function(one, two) {
    var a = one.sidebar || one.title;
    var b = two.sidebar || two.title;

    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    var i = order.indexOf(a);
    var j = order.indexOf(b);

    if (~i && ~j) {
      if (i < j) return -1;
      if (j < i) return 1;
      return 0;
    }

    if (~i) return -1;
    if (~j) return 1;

    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a[0] === '.') return 1;
    if (b[0] === '.') return -1;
    if (a < b) return -1;
    if (b < a) return 1;
    return 0;
  };
}
