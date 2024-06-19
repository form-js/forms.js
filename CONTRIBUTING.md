# Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, request update the documentation via issue or discussions.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/briandk/transcriptase-atom/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

To quickly reproduce the bug you can use the [forms.js codepen template!](https://codepen.io/pen?template=zYeXvMm) It also includes taiwlind for quick prototyping.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Available commands

- run `npm run lint` for style unification
- run `npm run format` to format the code
- run `npm run build` to build each package
- run `npm run test` to run automated tests

## Local Testing

To test the changes locally you will need to build the package that you made changes to (the example is core):

```bash
npm --prefix ./packages/core run build
```

You can then create your test case in `public\app.js` to watch the changes run `npm run watch-local`. 

Run local server:

```bash
npm start
```

## Automated tests

We use jest for automated tests. Each package has folder where tests can be written and we try to keep the coverage as close to 100% as possible. Each major change or feature should introduce a updated or new test that covers it.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
