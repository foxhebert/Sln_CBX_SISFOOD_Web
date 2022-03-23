const mix = require("laravel-mix");
const EncodingPlugin = require('webpack-encoding-plugin');

mix.disableNotifications();

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    node: {
        fs: 'empty'
    },
    externals: [{
        './cptable': 'var cptable'
    }],
    plugins: [new EncodingPlugin({
        encoding: 'ISO-8859-1'
    })]
});

//mix.copyDirectory("node_modules/@mdi/font/fonts", "public/fonts");
//mix.copyDirectory("node_modules/font-awesome/fonts", "public/fonts");




//mix.styles(
 //   [
  //      "Content/bootstrap/bootstrap.css",
 //       "Content/custom.css",
//        "Content/site.css"
 //   ],
 //   "Content/app.css"
//);

mix.js("Resources/vendor/app.js", "Scripts/vendorapp.js");


mix.scripts([
    "Scripts/vendorapp.js",
    "Scripts/site.js",
    "Resources/Empleado/empleado.js",
    "Resources/Mificha/mificha.js",
], 'Scripts/all.js');


//mix.js("resources/vue/app.js", "Scripts/app.js");
