/**
 * System configuration for Angular 2 apps
 * Adjust as necessary for your application needs.
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',

    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'angular2-grid':              'node_modules/angular2-grid/dist',
    'ng2-uploader':               'node_modules/ng2-uploader',
    'rxjs':                       'node_modules/rxjs',
    'ct-angular2-color-picker':   '/node_modules/ct-angular2-color-picker',
    'tinymce':                    '/node_modules/tinymce',
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'angular2-grid' :             { main: 'ngGrid.js',defaultExtension: 'js' },
    'ng2-uploader' :              { main: 'ng2-uploader.js',defaultExtension: 'js' },
    'ct-angular2-color-picker':   { main: 'ct-angular2-color-picker.js',defaultExtension: 'js' },
    'tinymce':                    { main: 'tinymce.js', defaultExtension: 'js' },  
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    if(pkgName === 'router'){
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }else{
        packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
  }

  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);

  var config = {
    map: map,
    packages: packages
  }

  System.config(config);

})(this);