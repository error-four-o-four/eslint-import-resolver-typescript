# eslint-import-resolver-typescript

```css
project-root/
├── node_modules/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── core/
│   │   ├── resolve.ts
│   │   ├── modulePathMapper.ts
│   │   └── ...
│   └── utils/
│       ├── helpers.ts
│       ├── log.ts
│       ├── path.ts
│       └── ...
├── tests/
│   ├── e2e/
│   ├── unit/
│   └── fixtures/
│       └── e2e/
├── tsconfig.json
├── tsconfig.base.json
├── vitest.e2e.ts
└── vitest.unit.ts
```

This plugin adds [`TypeScript`][] support to [`eslint-plugin-import`][] (Or maybe you want to try [`eslint-plugin-i`][] for faster speed)

This means you can:

- `import`/`require` files with extension `.cts`/`.mts`/`.ts`/`.tsx`/`.d.cts`/`.d.mts`/`.d.ts`
- Use [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) defined in `tsconfig.json`
- Prefer resolving `@types/*` definitions over plain `.js`/`.jsx`
- Multiple tsconfigs support just like normal
- `imports/exports` fields support in `package.json`

## Installation

```sh
# npm
npm i -D eslint-plugin-import-x eslint-import-resolver-typescript

# pnpm
pnpm i -D eslint-plugin-import-x eslint-import-resolver-typescript

# yarn
yarn add -D eslint-plugin-import-x eslint-import-resolver-typescript
```

<!--
## Configuration

Add the following to your `.eslintrc` config:

```jsonc
{
  "plugins": ["import"],
  "rules": {
    // turn on errors for missing imports
    "import/no-unresolved": "error"
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        "project": "path/to/folder",

        // Multiple tsconfigs (Useful for monorepos)

        // use a glob pattern
        "project": "packages/*/tsconfig.json",

        // use an array
        "project": [
          "packages/module-a/tsconfig.json",
          "packages/module-b/tsconfig.json"
        ],

        // use an array of glob patterns
        "project": [
          "packages/*/tsconfig.json",
          "other-packages/*/tsconfig.json"
        ]
      }
    }
  }
}
```
-->

## Options from [`enhanced-resolve`][]

| `mainFields` | `conditionNames` | `extensions` | `extensionAlias`                         |
| ------------ | ---------------- | ------------ | ---------------------------------------- |
| "types"     |  "types"         |  ".ts"        | ".js": [ ".ts", ".tsx", ".d.ts", ".js" ] |
| "typings"   |  "import"        |  ".tsx"       | ".jsx": [".tsx", ".d.ts", ".jsx"]        |
| "main"      |  "require"       |  ".d.ts"      | ".cjs": [".cts", ".d.cts", ".cjs"]       |
| "module"    |  "node"          |  ".js"        | ".mjs": [".mts", ".d.mts", ".mjs"]       |
| "exports"   |  "node-addons"   |  ".jsx"       |                                          |
|             |  "browser"       |  ".json"      |                                          |
|             |  "default"       |  ".node"      |                                          |

<!--
conditionNames, mainFields
APF: https://angular.io/guide/angular-package-format

extensions
`.mts`, `.cts`, `.d.mts`, `.d.cts`, `.mjs`, `.cjs` are not included because `.cjs` and `.mjs` must be used explicitly

extensionAlias
`.tsx` can also be compiled as `.js`
-->

### Other options

You can pass through other options of [`enhanced-resolve`][] directly

## Links

* [`eslint`][]
* [`eslint-plugin-import-x`][]
* [`enhanced-resolve`][]
* [`typescript`][]

## License

[ISC](https://opensource.org/licenses/ISC)

[`eslint`]: https://eslint.org/
[`eslint-plugin-import-x`]: https://github.com/un-ts/eslint-plugin-import-x
[`enhanced-resolve`]: https://github.com/webpack/enhanced-resolve
[`typescript`]: https://www.typescriptlang.org
[isc]: https://opensource.org/licenses/ISC

