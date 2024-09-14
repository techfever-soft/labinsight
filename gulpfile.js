var gulp = require("gulp");
var ts = require("gulp-typescript");
var path = require("path");

gulp.task("copy-python", async function () {
    var scriptsPath = path.join("dist", "src", "languages", "python", "scripts");
    gulp.src('src/**/*.py', { base: 'src/languages/python/scripts' })
        .pipe(gulp.dest(scriptsPath));
});