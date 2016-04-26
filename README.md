# Gulp Boilerplate

## Introduction
This is the Gulpfile that I created to smooth out and standardise the workflow for Magento theme development. By having a consistant setup, it will save time going forward when starting new site template builds.

## Setup
1. Install:
 * [sass](http://sass-lang.com/install)
 * [node.js](https://docs.npmjs.com/getting-started/installing-node)
 * [bower](http://bower.io/#install-bower)
 
2. From the command line, run ```bower install```
3. From the command line, run ```npm install```

You should see two new folders in the directory now:  
* node\_modules/  
* bower\_components/  

## Tasks
There are several tasks already created in the gulpfile.js.

### styles
This build the scss files in to the CSS file. There are a number of PostCSS actions that do fun things like add in any Google fonts, automatically adding the @font-face magic, autoprefixing the rules, removing comments and minifying the resulting file, and adds it to a dist/css folder.

### images
This compresses images and moves the optimised files to dist/images.

### svgsprite
This will look specifically for svg files matching the pattern icon-*.svg. The reason for this is that this is the first of two svg tasks. This one is for iconography, so the ```fill```  and ```style``` attributes are removed making the resulting icons white (because we can very easily change the colour in the CSS file). It will also minify and add it to a sprite sheet in dist/images.

### svgimg
Similar to above, it looks for files matching img-*.svg. This task will keep any style information in. I needed it primarily for svg based logos which can contain multiple fill colours.

### scripts
This performs actions on the javascript files in the template. The task will lint the code against a .jshintrc file (be sure to write one of these for your own standards, though I nabbed mine from [here](https://github.com/jshint/jshint/blob/master/examples/.jshintrc) as I was still learning it. The task then minifies, uglifies and squirts the file in to dist/js.

## Utility Tasks

### watch
This task will watch the appropriate locations and when they are triggered it will run the specific task for example if an scss file is changed, **styles** will run automagically.

### clean
This deletes everything that has been generated.

### build
This rebuilds everything from the above tasks.

##  Changelog
26-04-2016 - Version 1.0.1
Readme.rd correction - Ruby is not needed.

25-04-2016  - Version 1.0.0
Initial commit. Everything works peachy!


## Todo
* Add BrowserSync
* Look in to PhantomJS for regression testing

## Current Issues
* postcss-font-magician seems to have an issue with self-hosted fonts, so I have resorted to manually adding @font-face for hosted fonts, but Google fonts work perfectly.