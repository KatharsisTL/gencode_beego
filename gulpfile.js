'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let concat = require('gulp-concat');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');
let pug = require('gulp-pug');
let clean = require('gulp-clean');
let zip = require('gulp-zip');
let uglify = require('gulp-uglify');
let minifyCSS = require('gulp-minify-css');

let projName = "gencode_beego";

let modules = './node_modules';
let jsLibs = [
    `${modules}/vue/dist/vue.js`,
    `${modules}/vue-router/dist/vue-router.js`,
    `${modules}/vuetify/dist/vuetify.js`,
];
let cssLibs = [
    `${modules}/vuetify/dist/vuetify.css`,
];

gulp.task('sass', function() {
    let cssPath = './static/css';
    return gulp.src(['./src/sass/**/*.sass', './static/js/**/*.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(cssPath));
});

gulp.task('ts', function() {
    return gulp.src(['./static/js/**/*.ts'])
        .pipe(tsProject())
        .pipe(gulp.dest('./static/js'));
});

// gulp.task('ts_cmn', function() {
//     gulp.src(['./cmn/js/**/*.ts'])
//         .pipe(tsProject())
//         .pipe(gulp.dest('./cmn/js'));
// });

gulp.task('pug', function(callback) {
    let htmlPath = './views';
    return gulp.src(['./src/pug/**/*.pug', '!./src/pug/layouts/**/*.pug'])
        .pipe(pug({pretty: true}).on('error', function(err) {
            console.log(err.name+": "+err.message);
            callback();
        }))
        .pipe(gulp.dest(htmlPath));
});

gulp.task('clean', function() {
    return gulp.src('./dist/*')
        .pipe(clean());
});

gulp.task('pack1', function() {
    return gulp.src(['./conf/app.conf'])
        .pipe(gulp.dest(`./dist/${projName}/conf`));
});

gulp.task('pack2', function() {
    return gulp.src(['./static/**/*.js', './static/**/*.css', './static/**/*.map'])
        .pipe(gulp.dest(`./dist/${projName}/static`));
});

gulp.task('pack3', function() {
    return gulp.src(['./views/**/*.html'])
        .pipe(gulp.dest(`./dist/${projName}/views`));
});

gulp.task('pack4', function() {
    return gulp.src([`./${projName}`])
        .pipe(gulp.dest(`./dist/${projName}/`));
});

gulp.task('pack5', function() {
    return gulp.src(['./static/img/**/*'])
        .pipe(gulp.dest(`./dist/${projName}/static/img`));
});

gulp.task('pack6', function() {
    return gulp.src([`./${projName}.exe`])
        .pipe(gulp.dest(`./dist/${projName}/`));
});

gulp.task('pack7', function() {
    return gulp.src([`./static/fonts/**/*`])
        .pipe(gulp.dest(`./dist/${projName}/static/fonts`));
});

gulp.task('pack8', function() {
    return gulp.src([`./excel/**/*`])
        .pipe(gulp.dest(`./dist/${projName}/excel`));
});

gulp.task('zip', function() {
    return gulp.src('./dist/**/*.*')
        .pipe(zip(`${projName}.zip`))
        .pipe(gulp.dest('./dist'));
});

gulp.task('lib_js', function() {
    return gulp.src(jsLibs)
        .pipe(uglify())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./static/js/libs/'));
});

gulp.task('lib_css', function() {
    return gulp.src(cssLibs)
        .pipe(minifyCSS())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./static/css'));
});

gulp.task('libs', gulp.parallel('lib_js', 'lib_css'));

gulp.task('pack', gulp.series(['clean', 'pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6', 'pack7', 'pack8', 'zip']));

gulp.task('default', gulp.parallel('sass', 'ts', 'pug'));
//gulp.task('default', gulp.parallel('sass', 'pug'));

gulp.watch('./src/sass/**/*.sass', gulp.series('sass'));
gulp.watch('./static/js/**/*.ts', gulp.series('ts'));
gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));