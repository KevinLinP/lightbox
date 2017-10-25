import { Template } from 'meteor/templating';

import { Programs } from '../api/programs.js';

import './viewer.html';

// http://kapadia.github.io/emscripten/2013/09/13/emscripten-pointers-and-pointers.html
Template.body.helpers({
  program() {
    const program = Programs.findOne({});
    console.log(program.compileError);
    
    
    return program;
  }
});
