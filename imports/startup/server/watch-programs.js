import { Meteor } from 'meteor/meteor';

import { Programs } from '../../api/programs.js';

const callEmscripten = (path) => {
  const { exec } = require('child_process');
  const tempPath = Meteor.absolutePath + '/.emscripten/output/program.js';

  let command = Meteor.absolutePath + '/.emscripten/emcc';
  command += ' -o ' + tempPath;
  command += ' -s ' + "EXPORTED_FUNCTIONS=\"['_int_sqrt']\"";
  command += ' ' + path;

  console.log(command);

  const execCallback = (error, stdout, stderr) => {
    const program = Programs.findOne({});

    if (!error) {
      Programs.update(program._id, {
        $set: {
          compileError: null
        }
      });

      readEmscriptenOutput(tempPath);
    } else {
      Programs.update(program._id, {
        $set: {
          jsCode: null,
          compileError: error
        }
      });
    }
  };

  exec(command, {}, Meteor.bindEnvironment(execCallback));
};

const readEmscriptenOutput = (tempPath) => {
  const fs = require('fs');
  const readFileCallback = (err, data) => {
    if (!err) {
      const program = Programs.findOne({});

      Programs.update(program._id, {
        $set: {jsCode: data}
      });
    } else {
      console.log('output read error: ' + err);
    }
  };

  fs.readFile(tempPath, 'utf8', Meteor.bindEnvironment(readFileCallback));
};

if (Meteor.isServer) {
  Meteor.startup(() => {
    const chokidar = require('chokidar');

    const programsDir = Meteor.absolutePath + '/led_programs';
    const watchOptions = {persistent: true};

    const onChangeCallback = (path) => {
      const fs = require('fs');
      const readFileCallback = (err, data) => {
        if (!err) {
          const program = Programs.findOne({});
          Programs.update(program._id, {
            $set: {cCode: data}
          });
          callEmscripten(path);
        } else {
          console.log('source read error: ' + err);
        }
      };

      fs.readFile(path, 'utf8', Meteor.bindEnvironment(readFileCallback));
    };

    chokidar.watch(programsDir, watchOptions).on('change', Meteor.bindEnvironment(onChangeCallback));
  });
}
