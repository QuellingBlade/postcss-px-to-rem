# postcss-px-to-viewport

A plugin for [PostCSS](https://github.com/ai/postcss) that generates rem from pixel units.

## Usage

If your project involves a fixed width, this script will help to convert pixels into rem.

### Input/Output

```css
// input

.class {
  margin: -10px .5vh;
  padding: 5vmin 9.5px 1px;
  border: 3px solid black;
  border-bottom-width: 1px;
  font-size: 14px;
  line-height: 20px;
}
.class2 {
  border: 1px solid black;
  margin-bottom: 1px;
  font-size: 20px;
  line-height: 30px;
}
@media (min-width: 750px) {
  .class3 {
    font-size: 16px;
    line-height: 22px;
  }
}

html, body {
  background: red;
}

.test {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 1920px;
  height: 1080px;
  background: yellow;
}


// output

.class {
  margin: -0.05208rem .5vh;
  padding: 5vmin 0.04948rem 1px;
  border: 0.01563rem solid black;
  border-bottom-width: 1px;
  font-size: 0.07292rem;
  line-height: 0.10417rem;
}
.class2 {
  border: 1px solid black;
  margin-bottom: 1px;
  font-size: 0.10417rem;
  line-height: 0.15625rem;
}
@media (min-width: 750px) {
  .class3 {
    font-size: 0.08333rem;
    line-height: 0.11458rem;
  }
}

html, body {
  background: red;
}

.test {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 10rem;
  height: 5.625rem;
  background: yellow;
}
```

### Options

Default:
```js
{
  unitToConvert: 'px',
  viewportWidth: 320,
  unitPrecision: 5,
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',  // vmin is more suitable.
  selectorBlackList: [],
  minPixelValue: 1,
  mediaQuery: false
}
```
- `unitToConvert` (String) unit to convert, by default, it is px.
- `viewportWidth` (Number) The width of the viewport.
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `viewportUnit` (String) Expected units.
- `selectorBlackList` (Array) The selectors to ignore and leave as px.
    - If value is string, it checks to see if selector contains the string.
        - `['body']` will match `.body-class`
    - If value is regexp, it checks to see if the selector matches the regexp.
        - `[/^body$/]` will match `body` but not `.body`
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.

### Use with gulp-postcss

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var pxtoviewport = require('postcss-px-to-viewport');

gulp.task('css', function () {

    var processors = [
        pxtoviewport({
            viewportWidth: 320,
            viewportUnit: 'vmin'
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```

> use with [lib-flexible-for-dashboard](https://github.com/QuellingBlade/lib-flexible-for-dashboard) to develop flexible fullscreen dashbord.
