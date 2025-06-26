# @vitejs/plugin-static

The `@vitejs/plugin-static` is a plugin to handle static files

## Getting Started

To begin, you'll need to install `@vitejs/plugin-static`:

```console
npm install --save-dev @vitejs/plugin-static
```

or

```console
yarn add -D @vitejs/plugin-static
```

or

```console
pnpm add -D @vitejs/plugin-static
```

Then add the plugin to your `vite.config.js` config. For example:

**vite.config.js**

```js
import staticPlugin from '@vitejs/plugin-static'

export default {
    plugins: [
      staticPlugin({
        ignore: []
      })
    ],
};
```

And run `vite build` via your preferred method.

## Options

- **[`ignore`](#ignore)**


### `ignore`

Type:

```ts
type ignore = array
```

Default: `[]`

Allow you to ignore some files in static folder after building project,support glob patterns
you can learn that [here](https://www.npmjs.com/package/glob)
