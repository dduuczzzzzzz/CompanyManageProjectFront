<h1 align="center">React CRA Boilerplate</h1>
<br>

## Features

- [React Query][react-query]
- [React Router][react-router]
- [Typescript][typescript]
- [ESLint][eslint]
- [Prettier][prettier]
- [Ant Design][ant-design]
- [Tailwindcss][tailwindcss]
- [Axios][axios]

## Set up

1. Clone the project
2. `cd folder`
3. `npm install`
4. That's it! See the **Available Commands** list below.

&nbsp;

## Available Commands

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. Use `npm run test:no-watch` to run tests without a watcher.<br />

### `npm run lint`

Runs the ESLint typescript code lint checker. Running `npm run lint:fix` will automatically fix any lint errors where possible.

### `npm run build`

Builds a production version of the app inside the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npx prettier --write src`

Use prettier to reformat all the code in the src folder

&nbsp;

## Host your production build locally

This can be useful when testing production builds vs dev builds or checking how well your build is minified.

1. `npm run build`
2. `npx serve -s build`

&nbsp;

## Updating dependencies

`npm-check-updates` makes it easy to update your dependencies. All you have to do is run the following:

1. `npm install -g npm-check-updates`
2. `ncu -u` which displays the outdated dependencies and updates your `package.json` file.
3. `npm install` which will then install the new versions for you.

&nbsp;

## Clean git history

When cloning this repository you will get all of it's git history. If you would like to start fresh please do the following:

1. Delete the `.git` folder
2. `git init`

This will also clear the husky config (tool that checks passing tests before git commit) so to re-enable this you will need to `npm install --save-dev husky` again.

&nbsp;

## Recommended VS Code Extensions

- [Prettier][vscode-extension-prettier]
- [Spell Checker][vscode-extension-spell-checker]
- [ESLint][vscode-extension-eslint]
- [Git Lens][vscode-extension-git-lens]

&nbsp;

## TODO

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[typescript]: https://github.com/microsoft/TypeScript
[react-query]: https://tanstack.com/query/v5/docs/react/quick-start
[cra]: https://github.com/facebook/create-react-app
[axios]: https://axios-http.com/docs/intro
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/docs/en/index.html
[react-router]: https://reactrouter.com/en/main/start/tutorial
[vscode-extension-prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[vscode-extension-spell-checker]: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
[vscode-extension-eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[vscode-extension-git-lens]: https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
[ant-design]: https://ant.design/components/overview/
[tailwindcss]: https://tailwindcss.com/
<!-- prettier-ignore-end -->
