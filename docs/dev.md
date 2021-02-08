# dev notes

## local dev

Using `npm link` may lead to hooks issues (with React in both `node_modules`)

Linking manually the parent React turned out to be a solution:

```sh
> cd path/to/your/project
> npm link hookstores
> rm -rf node_modules/react
> ln -s ~/absolute/path/to/hookstores/node_modules/react ~/absolute/path/to/your/project/node_modules/react
```

then use rollup for every changes to `src`

```sh
> npm run build
```
