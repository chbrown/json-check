# json-check

`json-check file1.json file2.json ...` checks that each file contains a single JSON-formatted entity.

* Every file will be parsed with `JSON.parse()`. If that throws an error, the script will immediately print the filename to `stdout`.
  - If the `-v` / `--verbose` flag is provided, it will print the `JSON.parse()` error message to `stderr`.
  - The script will continue to check all the other files.
* If `JSON.parse()` throws an error for _any_ of the files, the process will exit with code 65 (`EX_DATAERR`) when it has finished checking all files. Otherwise, it will exit with code 0 (`EX_OK`).
* If any of the files cannot be read, the script will immediately throw an error and exit with code 66 (`EX_NOINPUT`).


## License

Copyright 2015 Christopher Brown. [MIT Licensed](http://opensource.org/licenses/MIT).
