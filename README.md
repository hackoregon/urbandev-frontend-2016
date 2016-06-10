PlotPDX Front-end App
================

The front-end for the PlotPDX App is a simple jQuery application built using Grunt, a Javascript task runner that uses NodeJS. 

Grunt is configured using a Yeoman configuration called [Generator Web App](https://github.com/yeoman/generator-webapp). Make sure to read the documentation to see how everything works.

## Required installs

* NodeJS (and npm)

* Grunt (run `npm install -g grunt-cli`)

* Bower (run `npm install -g bower`)


## Getting Started

	# Do the following steps in the root project directory

    # 1. Install libraries and dependencies (only need to do this once)
    npm install && bower install

    # 2. Create a BLANK aws.json credentials file in the root project directory (KEEP OUT OF VERSION CONTROL)
    echo '{"key": "","secret": "","bucket": ""}' >> aws.json

    # 3. Run app on local web server for development
    grunt serve

    # 4. Build app and deploy to S3 (requires aws.json file with proper credentials)
    grunt build

