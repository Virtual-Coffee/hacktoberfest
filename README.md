# Virtual Coffee Hacktoberfest Initiative (vchi)

## Local Development Setup

Steps to run the site locally for development or curiosity

### 1. Fork and clone the repository

Follow [these steps](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) to create a fork of this repository and clone it to your local machine.

### 2. Navigate to the repo directory

If you have just run `git clone ...` , the next step would be to move into the cloned repo:

```shell
cd hacktoberfest
```

### 3. Install dependencies

This repo requires `node`, `pnpm`, and the [Netlify CLI](https://www.netlify.com/products/dev/) to get started.

#### Installing `node`:

The best way to install `node` is to [download the installer](https://nodejs.org/en/) from their site. This repo requires `node` version `18.16`, which is the latest [LTS version](https://nodejs.dev/en/about/releases/).

If you already have a different version of `node` installed, but don't want to update globally, you can install [a package called `nvm`](https://github.com/nvm-sh/nvm), which will allow you to easily switch `node` versions. Once you have `nvm` installed (or if you already have it installed), you can run `nvm use` in the main directory and it will install the proper version of `node`.

#### Installing `pnpm`:

`pnpm` is a package manager that is used to install the rest of our dependencies.

Read more about `pnpm` [on their docs site](https://pnpm.io/motivation).

The best way to install `pnpm` for this project is by using [Corepack](https://nodejs.org/api/corepack.html), a new feature bundled with Node.

Install pnpm via corepack with the following commands:

```sh
corepack enable
corepack prepare
```

#### Setting up your .env

Use the following command to create a local `.env` file. Then open the new file (`.env`) and adjust any settings that are needed.

```shell
cp .env.example .env
```

#### Installing package dependencies

Once you have `node`, `pnpm`, and the Netlify CLI installed, you're ready to install the local dependencies! Run the following command:

```shell
pnpm install
```

At this point you're ready to roll! Run the following command to get rolling!

```shell
pnpm dev
```

Read more about what `pnpm dev` does in the following section.

## Commands

The following commands are available for your use. Most of the time you'll only ever need `pnpm dev`.

### `pnpm dev`

```shell
pnpm dev
```

This is the only command you need to do normal local development.

Starts a local server and watches your source files for changes. Use this to preview local development.

Once you run this command, a local server is running at http://localhost:3000! Any changes you make to the src folder should also re-build the site and re-load your browser.

You should see something like 'Server now ready on http://localhost:3000' below, which means the watcher is waiting to build your awesome changes!

Use ctrl-c to quit the server when you're done.

## Uses:

- [NextJS](https://nextjs.org/docs/)
- [Tailwind UI](https://tailwindui.com)
- Hosted on [Netlify](https://www.netlify.com/)
