# mywebsocketio

- npm init -y
- npm install typescript ts-node-dev --save-dev
- npx tsc --init
- mkdir src
- create src/index.ts
- Create npm scritps

```js
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  }
}

```

- npm run build
- npm run dev
- npm run start

# tsconfig

```js
{
  "compilerOptions": {
    "target": "ES6",                      // Specify ECMAScript target version
    "module": "commonjs",                 // Specify module code generation
    "outDir": "./dist",                   // Redirect output structure to the directory
    "rootDir": "./src",                   // Specify the root directory of input files
    "strict": true,                       // Enable all strict type-checking options
    "esModuleInterop": true,              // Enables emit interoperability between CommonJS and ES Modules
    "skipLibCheck": true,                 // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true // Disallow inconsistently-cased references to the same file
  }
}
```

## You can also use nodemon

- npm install nodemon ts-node --save-dev
- Add below in nodemon.json

```js
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/index.ts"
}

```

- add in package.json

```js
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon"
  }
}
```

- npm run dev