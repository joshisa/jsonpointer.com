import Ember from 'ember';
import pointer from 'npm:json-pointer';
import jsonStringifier from '../utils/json-stringifier';

export default Ember.Controller.extend({
  json: '',
  pointer: '',
  hasPointerMatch: Ember.computed.bool('pointerObject'),
  queryParams: ['pointer', 'json'],

  object: Ember.computed('json', function() {
    try { return JSON.parse(this.get('json')); }
    catch (e) { return undefined; }
  }),

  stringifiedObject: Ember.computed('object', 'pointer', function() {
    if (typeof this.get('object') === 'undefined') {
      return 'The JSON object you entered is invalid.';
    }
    return jsonStringifier(this.get('object'), this.get('pointer'));
  }),

  pointerObject: Ember.computed('pointer', 'object', function() {
    if (!this.get('pointer')) { return false; }
    try {
      return pointer.get(this.get('object'), this.get('pointer'));
    }
    catch (e) { return undefined; }
  }),

  stringifiedPointerObject: Ember.computed('pointerObject', function() {
    if (typeof this.get('pointerObject') === 'undefined') {
      return 'Please enter a valid JSON object and pointer.';
    }
    return JSON.stringify(this.get('pointerObject'), null, '  ');
  }),

  placeholders: [
    {
      pointer: '/westeros/rulers/0',
      object: {
        westeros: {
          kingdomCount: 7,
          rulers: [
            'Robert Baratheon',
            'Joffrey Lannister',
            'Tommen Lannister'
          ]
        }
      }
    },
    {
      pointer: '/senses/5',
      object: {
        senses: [
          'sight',
          'sound',
          'smell',
          'touch',
          'taste',
          'sixth'
        ]
      }
    },
    {
      pointer: '/rules/1',
      object: {
        members: ['Cornelius', 'Tyler', 'Bob'],
        rules: [
          'You do not talk about Fight Club.',
          'You do not talk about Fight Club.',
          'Someone yells stop, goes limp, taps out, the fight is over.',
          'Only two guys to a fight.',
          'One fight at a time.',
          'No shirts, no shoes.',
          'Fights will go on as long as they have to.',
          'If this is your first night at Fight Club, you have to fight.'
        ]
      }
    }
  ],

  chosenPlaceholder: Ember.computed('placeholders', function() {
    var placeholders = this.get('placeholders');
    var randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }),

  objectPlaceholder: Ember.computed('chosenPlaceholder', function() {
    return JSON.stringify(this.get('chosenPlaceholder').object, null, '  ');
  }),

  pointerPlaceholder: Ember.computed('chosenPlaceholder', function() {
    return this.get('chosenPlaceholder').pointer;
  }),

  actions: {
    formatJson: function() {
      this.set('json', JSON.stringify(this.get('object'), null, 2));
    }
  }
});
