import { Meteor } from 'meteor/meteor';
//import { chokidar } from 'chokidar';

import { Programs } from '../../api/programs.js';

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
          console.log(program);
          Programs.update(program._id, {cCode: data});
        }
      };

      fs.readFile(path, 'utf8', Meteor.bindEnvironment(readFileCallback));
    };

    chokidar.watch(programsDir, watchOptions).on('change', Meteor.bindEnvironment(onChangeCallback));
  });
}
