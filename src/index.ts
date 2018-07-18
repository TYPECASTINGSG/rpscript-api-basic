import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';
import { EventEmitter } from 'events';

/** Basic utility for rpscript. Contain basic operation such as condition, event listening, variable assignment, terminal print etc.
 * @namespace Basic
 * 
 * @example
 * rps install basic
*/
@RpsModule("basic")
export default class RPSBasic {

/**
 * @function console-log
 * @memberof Basic
 * @example
 * ;print 'Hello'
 * console-log 'Hello'
 * ;print 'Hello' again
 * console-log $RESULT
 * 
 * @param {string} text information to be printed out on the terminal.
 * @returns {*}  Similar to text input.
 * @summary print out text on console.
 * @description
 * This is a wrapper for javascript console.log function.
 * 
 * @see {@link https://www.w3schools.com/jsref/met_console_log.asp}
 * 
*/
  @rpsAction({verbName:'console-log'})
  async print(ctx:RpsContext,opts:{}, text:any) : Promise<any>{
    console.log(text);
    return text;
  }

  /**
 * @function as
 * @memberof Basic
 * @example
 * as 'varName' 1
 * ;print out the value 1
 * console-log $varName
 *
 * read 'filename.txt' | as 'varName'
 * ;this will print out the content of 'filename.txt'
 * console-log $varName
 * 
 * @param {string} variable Variable name.
 * @param {*} value  Value to be assigned to the variable.
 * @returns {*}  Value of the variable.
 * @summary Variable assignment.
 * @description
 * This is equivalent to variable assignment in programming language.
 * The assigned variable can be access by prefixing $ on the variable name.
 * 
 * 
*/
  @rpsAction({verbName:'as'})
  as (ctx:RpsContext,opts:{}, variable:string, value:any) : Promise<any>{
    variable = variable.trim();
    ctx.variables[variable] = value;

    if(variable.charAt(0)!=='$') variable = '$'+variable;

    ctx.variables[variable] = value;

    return Promise.resolve(value);
  }

/**
 * @function assign
 * @memberof Basic
 * 
 * @param {string} variable Variable name.
 * @param {*} value  Value to be assigned to the variable.
 * @returns {*}  Value of the variable.
 * @summary synonyms: as.
 * 
 * 
*/  
  @rpsAction({verbName:'assign'})
  assign (ctx:RpsContext,opts:{}, variable:string, value:any) : Promise<any>{
    variable = variable.trim();
    ctx.variables[variable] = value;

    if(variable.charAt(0)!=='$') variable = '$'+variable;

    ctx.variables[variable] = value;

    return Promise.resolve(value);
  }

/**
 * @function if
 * @memberof Basic
 * @example
 * if $varName == 1 @ {
 *  console-log "varName is 1"
 * }
 * 
 * @param {boolean} condition Condition to be met.
 * @param {function} exec () => * . Function to be executed if the condition is met.
 * @returns {* | null }  If condition is met, result of exec. else null.
 * @summary If condition
 * @description
 * Equivalent to if condition in programming language.
 * 
 * 
*/
  @rpsAction({verbName:'if'})
  if (ctx:RpsContext,opts:{}, condition:boolean, exec:Function) : Promise<any>{
    if(condition) return Promise.resolve(exec());
    else return Promise.resolve(null);
  }

  /**
 * @function once
 * @memberof Basic
 * @example
 * once 'connected' $emitter
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen to event once
 * 
 * @see {@link https://nodejs.org/api/events.html#events_emitter_once_eventname_listener}
 * 
*/
  @rpsAction({verbName:'once'})
  once (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string) : Promise<any>{
    return new Promise(function(resolve) {
      event.once(evtName, (...params) => resolve(params));
    });
  }

/**
 * @function on
 * @memberof Basic
 * @example
 * on $emitter 'start' @ $output { console-log $output }
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen to event once
 * 
 * @see {@link https://nodejs.org/api/events.html#events_emitter_once_eventname_listener}
 * 
*/
  @rpsAction({verbName:'on'})
  async on (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string, cb:(any)=>void) : Promise<EventEmitter>{
    event.on(evtName, (...params) => cb(params));
    return event;
  }


/**
 * @function data-type
 * @memberof Basic
 * @example
 * console-log data-type 'string-variable'
 * ; Print 'string'
 * console-log data-type 1
 * ;Print 'number'
 * 
 * @param {*} item
 * @returns {string} Information on the data type of the item.
 * @summary derive the data type of result.
 * 
*/
  @rpsAction({verbName:'data-type'})
  async dataType (ctx:RpsContext,opts:{}, item:any) : Promise<string>{
    let type;
    if(item instanceof Array) type = 'array';
    else if(item instanceof Object) type = 'object';
    else type = typeof item;
    
    return type;
  }

  /**
 * @function wait
 * @memberof Basic
 * @example
 * ;wait for 5 second
 * wait 5
 * 
 * @param {number} period Period to wait for in second.
 * @returns {*} Previous result.
 * @summary Pause the application for a period of time.
 * 
*/
  @rpsAction({verbName:'wait'})
  wait (ctx:RpsContext,opts:{}, period:number) : Promise<any>{
    return new Promise(function(resolve) {
      setTimeout(function () {
        resolve(ctx.$RESULT);
      }, period*1000);
    });
  }

/**
 * @function get-element
 * @memberof Basic
 * @example
 * ;wait for 5 second
 * assign 'items' {a:1 , b:{c:2,d:3}}
 * get-element $items 'b' 'c'
 * ;print 3
 * console-log $RESULT
 * 
 * @param {*} item Object to get the element from.
 * @param {list} keys List of keys to get element from.
 * @returns {*} Result.
 * @summary Get the element of an object.
 * 
*/
  @rpsAction({verbName:'get-element'})
  async getElement (ctx:RpsContext,opts:{},items:any, ...position :any[]) : Promise<any>{
    
    let v = items;
    for(var i=0;i<position.length;i++){
      v = v[ position[i] ];
      if(v===undefined)return undefined;
    }
    return v;
  }

  /**
 * @function return
 * @memberof Basic
 * @example
 * assign 'item' [1,2,3]
 * return $item
 * ;Print out [1,2,3]
 * console-log $RESULT
 * 
 * @param {*} item 
 * @returns {*} item.
 * @summary return input.
 * 
*/
@rpsAction({verbName:'return'})
async ret (ctx:RpsContext,opts:{},item:any) : Promise<any>{
  return item;
}



}
