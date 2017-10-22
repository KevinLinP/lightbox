import { Template } from 'meteor/templating';

import { Programs } from '../api/programs.js';

import './viewer.html';

Template.body.helpers({
  program() {
    return Programs.findOne({});
  }
});
