1> Install Node.js: https://nodejs.org/

2> Run Node.js command prompt

3> Cd to _build folder

4> Edit _build > build.json

# baseUrl – this parameter sets the base path for the r.js compiler to use. It is relative to the current path.
# name – specifies the module that should server as the root of the application. This dependency tree of modules to include will be figured out starting from this module.
# include – a list of modules that should be included in addition to the modules found by processing the name module
# optimize - specifies the type of optimization, or minification, to use, such as uglify2 or none
# out – specifies the output file relative to the current location. This does not use baseUrl
# insertRequire – when present, automatically inserts a require() statement for the specified module at the end of the built output file.

5> Run build.bat