#!/usr/bin/env node
var fs = require('fs');
var async = require('async');

var yargs = require('yargs')
  .usage('Usage: json-check <file> [<file> ...]')
  .describe({
    help: 'print this help message',
    verbose: 'print JSON.parse error messages',
    version: 'print version',
  })
  .alias({
    h: 'help',
    v: 'verbose',
  })
  .boolean([
    'help',
    'verbose',
    'version',
  ]);

function main() {
  var argv = yargs.argv;

  if (argv.help) {
    yargs.showHelp();
  }
  else if (argv.version) {
    console.log(require('./package').version);
  }
  else {
    argv = yargs.demand(1).argv;

    checkAll(argv._, argv.verbose, function(error, syntaxError) {
      if (error) {
        console.error(error.message);
        process.exit(66);
      }
      if (syntaxError) {
        process.exit(65);
      }
      process.exit(0);
    });
  }
}

/**
Check the given filenames in parallel. If a file read error occurs, throw it
and kill the whole process. If a JSON parse error occurs, write the filename to
`stdout` immediately. If `verbose` is true, also print the parse error.
*/
function checkAll(filenames, verbose, callback) {
  async.map(filenames, function(filename, callback) {
    check(filename, function(error, syntaxError) {
      if (error) return callback(error);
      if (syntaxError) {
        console.log(filename);
        if (verbose) {
          console.error(filename + ': ' + syntaxError.message);
        }
      }
      callback(null, syntaxError);
    });
  }, function(error, syntaxErrors) {
    if (error) return callback(error);
    var syntaxError = syntaxErrors.some(function(syntaxError) { return syntaxError; });
    callback(null, syntaxError);
  });
}

/**
Read the file at `filename` and try to parse the contents with JSON.parse. If
fs.readFile produces an error, call callback(error). If JSON.parse fails, call
callback(null, syntaxError).
*/
function check(filename, callback) {
  fs.readFile(filename, function(error, data) {
    if (error) return callback(error);
    try {
      JSON.parse(data);
    }
    catch (syntaxError) {
      return callback(null, syntaxError);
    }
    return callback();
  });
}

if (require.main === module) {
  main();
}
