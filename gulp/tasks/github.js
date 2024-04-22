import github from 'gulp-gh-pages';


export const github = () => {
   return app.gulp.task('deploy', function () {
      return gulp.src('./dist/**/*')
         .pipe(ghPages());
   });
}