var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

// the "model", or data store
var _store = {
  list: []
};

// Two setter methods, which are the only interface for manipulating the data in the store
var addItem = function(item){
  _store.list.push(item);
};

var removeItem = function(index){
  _store.list.splice(index, 1);
};

// the Store, just getters, plus helpers
// objectAssign enables extend/combine objects to make 'super objects'
// So, todoStore winds up with all the properties of EventEmitter.prototype, plus...
var todoStore = objectAssign({}, EventEmitter.prototype, {
  // cb is the _.onChange passed in ListContainer.js
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    // ditto
    this.removeListener(CHANGE_EVENT, cb);
  },
  // this is the getList used in ListContainer.js getInitialState
  getList: function(){
    return _store.list;
  }
});

// listen for certain events and invoke setters when we hear them
AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
  case appConstants.ADD_ITEM:
    addItem(action.data);
    todoStore.emit(CHANGE_EVENT);
    break;
  case appConstants.REMOVE_ITEM:
    removeItem(action.data);
    todoStore.emit(CHANGE_EVENT);
    break;
  default:
    return true;
  }
});

module.exports = todoStore;
