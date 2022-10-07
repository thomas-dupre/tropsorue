# Tropsorue

Example NodeJS project with the use of :

- prettier
- estlint
- mocha
- chai
- sinon
- serverless (esbuild)
- express (& nodemon)

# Quick start

This package uses yarn

Clone the repository and install the node_modules with `yarn` command

Run `yarn server` to launch an express local server (you can test it with postman or curl or someother api tool)

## Code quality

Use `yarn format:fix` command to fix your code with the prettier config

Use `yarn lint:fix` command to fix your code with the linter config

## Testing

Use `yarn test` command to run the unit tests or `yarn test:cov` to run the coverage analysis

## Deploy

Configure you aws credentials with `aws configure` and/or edit the profile in `serverless.yml`

Use `yarn sls:deploy` to deploy the gateway api & lambda to aws with cloudformation
