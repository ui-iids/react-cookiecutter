# project_name

project_description

## Install

This package intends `pnpm` as its build system and package manager, but is likely compatible with `npm`.

To install the project, install `pnpm` through your local package manager or `npm i -g pnpm`.

Then run

```
pnpm i
```

in the root directory.

## Run

To run the project as a developer, run:

```bash
pnpm run dev
```

To run the project as a standalone server, run:

```bash
pnpm run build
pnpm run vite preview
```

To run the project in a container, after installing docker, run:

```bash
docker build -t project_name -f Containerfile .
docker run -d --name project_name -p 8005:8000 project_name
```

Then navigate to `locahost:8005`.

To delete, run:

```bash
docker stop project_name
docker container rm project_name
docker image rm project_name
```

## Deploy

## Updating

## Authors

Clinton Bradford, cbradford@uidaho.edu

Based on the [IIDS React Cookiecutter](https://github.com/ui-iids/react-cookiecutter)
