/* eslint-disable */
'use strict';
const babelOptions = {presets: ['react-native']};

require('babel-register')(babelOptions);
require('babel-polyfill');

var Jasmine = require('jasmine');
var jrunner = new Jasmine();

jrunner.loadConfig(
  {
    spec_dir: "test",
    spec_files: [
      "**/*.[sS]pec.js"
    ]
  });

jrunner.configureDefaultReporter({
  print(){
    //nothing
  }
});
if (process.env.IS_BUILD_AGENT) {
  var JasmineReporters = require('jasmine-reporters');
  jrunner.addReporter(new JasmineReporters.TeamCityReporter());
} else {
  var SpecReporter = require('jasmine-spec-reporter');
  jrunner.addReporter(new SpecReporter());
}

jrunner.execute();
