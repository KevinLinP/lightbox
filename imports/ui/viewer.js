import { Template } from 'meteor/templating';

import { Programs } from '../api/programs.js';

import { LedDisplay } from './led-display.js';
import './viewer.html';

Template.body.helpers({
  program() {
    const program = Programs.findOne({});

    return program;
  }
});

Tracker.autorun(() => {
  const program = Programs.findOne({});
  if (program && program.jsCode) {
    eval(program.jsCode);

    this.window.ledDisplay.reset(Module);
  }
});
