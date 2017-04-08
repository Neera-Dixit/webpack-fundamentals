webpack Watch Mode :
1. run webpack --watch in cmd
2. watch : true in webpack config file

webpack | webpack-dev-server config options
config options include 
1. -p : production mode (css and js in minified)
2. -d : enables sourcemaps in js

To start Node Server
1. In development mode , run npm start.
2. In production mode , run set NODE_ENV=production&& node ./src/server/server.js

It has webpack-dev-server and webpack-hot-middleware enabled when running node server in development mode

To build ouput files
1. npm run build

It has optimize-css-assets-webpack-plugin and uglifyjs plugin enabled

To start webpackdev-server
1. npm run webpack

this repo has custom loader called "stripjsoncomments" which removes the comments from json file.

