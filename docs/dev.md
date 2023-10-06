# dev notes

## local dev

Using `npm link` may lead to hooks issues (with React in both `node_modules`)

Linking manually the parent React turned out to be a solution:

```sh
> cd path/to/your/project
> npm link taverne
> rm -rf node_modules/react
> ln -s ~/absolute/path/to/taverne/node_modules/react ~/absolute/path/to/your/project/node_modules/react
```

then call `esbuild` for every changes to `src`

```sh
> npm run build
```

## publishing

- version
- push
- release
