# Quick Start

You can find the quick start examples in the `./examples` folder, feel free to run the commands
`npm run examples:basic` and `npm run examples:advanced` to check the results.

## Basic

In the basic example, we compile a simple script that imports a simple CSS.

```bash
css-modules-compiler compile ./examples/basic/src -t ./examples/basic/build
```

### Input

*index.css*
```css
.foo {
  color: red;
}
```

*index.js*
```javascript
import styles from './index.css'

document.body.innerHTML = `<button class="${styles.foo}">Yo</button>`
```

### Output

*styles.css*
```css
._foo_1829j_1 {
  color: red;
}
```

*index.js*
```javascript
// original css file: /path/to/index.css
const styles = {
  foo: '_foo_1829j_1'
};

document.body.innerHTML = `<button class="${ styles.foo }">Yo</button>`;
```

## Advanced

In the advanced example, we do a little bit more: the script uses two classes while the CSS composes a class and
imports an external file (we need `postcss-import` for that).

Two aspects worth mentioning:
- the `.foo` class is not present in the final CSS because all the empty classes are cleaned out at compile time
- all the files that match the `ba*.css` pattern get ignored during the build process

```bash
css-modules-compiler compile ./examples/advanced/src -t ./examples/advanced/build -b ba*.css -p postcss-import
```

### Input

*bar.css*
```css
.bar {
  color: green;
}
```

*baz.css*
```css
.baz {
  color: blue;
}
```

*index.css*
```css
@import './bar.css';

.foo {
  composes: .baz from './baz.css';
}
```

*index.js*
```javascript
import styles from './index.css'

document.body.innerHTML = `<button class="${styles.foo} ${styles.bar}">Yo</button>`
```

### Output

*styles.css*
```css
._baz_1hsk4_1 {
  color: blue;
}

._bar_1gsdk_1 {
  color: green;
}
```

*index.js*
```javascript
// original css file: /path/to/index.css
const styles = {
  bar: '_bar_1gsdk_1',
  foo: '_baz_1hsk4_1'
};

document.body.innerHTML = `<button class="${ styles.foo } ${ styles.bar }">Yo</button>`;
```
