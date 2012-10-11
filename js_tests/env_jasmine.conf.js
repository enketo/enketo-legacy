// Add any files here that need to be loaded before all tests are run, (e.g. third-party libraries, like jQuery)
//
// NOTE: Load order does matter.

// Load the envjasmine environment
EnvJasmine.loadGlobal(EnvJasmine.libDir + "envjs/env.rhino.1.2.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine/jasmine.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/mock-ajax.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/spec-helper.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-jquery/jasmine-jquery-1.2.0.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-rhino-reporter/jasmine-rhino-reporter.js");

// This is your main JavaScript directory in your project.
EnvJasmine.jsDir = EnvJasmine.rootDir + "/../../src/js/"; // project's main js directory.

EnvJasmine.includeDir = EnvJasmine.rootDir + "/../../public/libraries/"; // project's main js directory.
EnvJasmine.loadGlobal(EnvJasmine.includeDir + "jquery.min.js"); // for example, load jquery.
// TODO: Add your own

/******************************************************************************************************************

	run like this in terminal from project root:

	./lib/EnvJasmine/bin/run_all_tests.sh --testDir=../../js_tests --configFile=../../js_tests/env_jasmine.conf.js

 ******************************************************************************************************************/