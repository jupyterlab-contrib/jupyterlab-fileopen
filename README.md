# jupyterlab-fileopen

[![Extension status](https://img.shields.io/badge/status-ready-success "ready to be used")](https://jupyterlab-contrib.github.io/)
[![Github Actions Status](https://github.com/jupyterlab-contrib/jupyterlab-fileopen/actions/workflows/build.yml/badge.svg)](https://github.com/jupyterlab-contrib/jupyterlab-fileopen/actions?query=workflow%3ATests)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyterlab-contrib/jupyterlab-fileopen/master?urlpath=lab)
[![PyPI](https://img.shields.io/pypi/v/jupyterlab-fileopen)](https://pypi.org/project/jupyterlab-fileopen/)
[![Conda (channel only)](https://img.shields.io/conda/vn/conda-forge/jupyterlab-fileopen)](https://anaconda.org/conda-forge/jupyterlab-fileopen)

A JupyterLab extension that allows opening files and directories with external desktop applications.

### Reveal in OS-specific file explorer

![Open file explorer](https://raw.githubusercontent.com/jupyterlab-contrib/jupyterlab-fileopen/master/images/openfolder.gif)

### Open files with dedicated desktop application

![Open file with desktop app](https://raw.githubusercontent.com/jupyterlab-contrib/jupyterlab-fileopen/master/images/openfile.gif)

This extension is composed of a Python package named `jupyterlab-fileopen`
for the server extension and a NPM package named `jupyterlab-fileopen`
for the frontend extension.


## Requirements

* JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyterlab-fileopen
```

or:

```bash
conda install jupyterlab-fileopen -c conda-forge
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab-fileopen
```

or:

```bash
conda remove jupyterlab-fileopen -c conda-forge
```

## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```


## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-fileopen directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable jupyterlab-fileopen
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab-fileopen
pip uninstall jupyterlab-fileopen
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-fileopen` within that folder.
