import {RpsContext,RpsModule,rpsAction,R} from 'rpscript-interface';
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
 * @function log
 * @memberof Basic
 * @example
 * ;print 'Hello'
 * log 'Hello'
 * ;print 'Hello' again
 * log $RESULT
 * 
 * @param {string} text information to be printed out on the terminal.
 * @returns {*}  Similar to text input.
 * @summary log :: a → a
 * @description
 * This is a wrapper for javascript console.log function.
 * 
 * @see {@link https://www.w3schools.com/jsref/met_console_log.asp}
 * 
*/
  @rpsAction({verbName:'log'})
  async print(ctx:RpsContext,opts:{}, text:any) : Promise<any>{
    if(text){
      console.log(text);
      return text;
    }
    else {
      return console.log;
    }
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
 * @summary as :: String → a → a
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
 * @summary assign :: String → a → a
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
 * @function listen-once
 * @memberof Basic
 * @example
 * listen-once 'connected' $emitter
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen-once :: EventEmitter → String → a
 * 
 * @see {@link https://nodejs.org/api/events.html#events_emitter_once_eventname_listener}
 * 
*/
  @rpsAction({verbName:'listen-once'})
  once (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string) : Promise<any>{
    return new Promise(function(resolve) {
      event.once(evtName, (...params) => resolve(params));
    });
  }

/**
 * @function listen-on
 * @memberof Basic
 * @example
 * listen-on 'start' (($output)=>log $output) $emitter
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen-on :: String → (...* → *) → EventEmitter → EventEmitter
 * 
 * @see {@link https://nodejs.org/api/events.html#events_emitter_once_eventname_listener}
 * 
*/
  @rpsAction({verbName:'listen-on'})
  async on (ctx:RpsContext,opts:{}, evtName:string, cb:(any)=>void, event:EventEmitter) : Promise<EventEmitter>{
    event.on(evtName, (...params) => cb(params));
    return event;
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
 * @summary wait :: Number → a → a
 * 
*/
  @rpsAction({verbName:'wait'})
  wait (ctx:RpsContext,opts:{}, period:number, response?:any) : Promise<any>{
    response = response ? response : ctx.$RESULT;

    return new Promise(function (resolve,reject) {
      
      setTimeout(async function () {
        resolve(response);
      }, period*1000);

    });
  }

/**
 * @function stringify
 * @memberof Basic
 * @example
 * stringify {'a':1,'b':2}
 * 
 * @param {Object} object 
 * @returns {string} String result
 * @summary stringify :: a → String
 * 
*/
@rpsAction({verbName:'stringify'})
async stringify (ctx:RpsContext,opts:{}, obj:any) : Promise<string>{
  return JSON.stringify(obj);
}

/**
 * @function abs
 * @memberof Basic
 * @example
 * ;absolute value
 * abs -5.1
 * 
 * @returns {number} Absolute number.
 * @summary abs :: Number → Number
 * 
*/
@rpsAction({verbName:'abs'})
async abs (ctx:RpsContext,opts:{}, ...args:number[]) : Promise<number|Function>{
  return R.apply(R.curry(Math.abs),args);
}
/**
 * @function ceil
 * @memberof Basic
 * @example
 * ;ceil value
 * ceil 5.1
 * 
 * @param {number} number 
 * @returns {number} Absolute number.
 * @summary ceil :: Number → Number
 * 
*/
@rpsAction({verbName:'ceil'})
async ceil (ctx:RpsContext,opts:{}, ...args:number[]) : Promise<number|Function>{
  return R.apply(R.curry(Math.ceil),args);
}
/**
 * @function max
 * @memberof Basic
 * @example
 * ;max value
 * max 5.1 1.2 3.3
 * 
 * @param {number} number 
 * @returns {number} number.
 * 
 * @summary math-max :: Number → ...Number → Number
 * 
*/
@rpsAction({verbName:'math-max'})
async max (ctx:RpsContext,opts:{}, ...num:number[]) : Promise<number>{
  return R.apply(R.curryN(2,Math.max),num);
}
/**
 * @function min
 * @memberof Basic
 * @example
 * ;min value
 * min 5.1 1.2 3.3
 * 
 * @param {...number} number 
 * @returns {number} number.
 * 
 * @summary math-min :: Number → ...Number → Number
 * 
*/
@rpsAction({verbName:'math-min'})
async min (ctx:RpsContext,opts:{}, ...num:number[]) : Promise<number>{
  return R.apply(R.curryN(2,Math.min),num);
}
/**
 * @function floor
 * @memberof Basic
 * @example
 * ;floor value
 * floor 5.1
 * 
 * @param {number} number 
 * @returns {number} number.
 * 
 * @summary floor :: Number → Number
 * 
*/
@rpsAction({verbName:'floor'})
async floor (ctx:RpsContext,opts:{}, ...num:number[]) : Promise<number>{
  return R.apply(R.curry(Math.floor),num);
}
/**
 * @function power
 * @memberof Basic
 * @example
 * ;power value
 * power 5 3
 * 
 * @param {number} x
 * @param {number} y 
 * @returns {number} number.
 * 
 * @summary pow :: Number → Number → Number
 * 
*/
@rpsAction({verbName:'pow'})
async power (ctx:RpsContext,opts:{}, ...args:number[]) : Promise<number|Function>{
  return R.apply(R.curry(Math.pow),args);
}
/**
 * @function random
 * @memberof Basic
 * @example
 * ;random
 * random 
 * 
 * @returns {number} number.
 * 
 * @summary random :: Number
 * 
*/
@rpsAction({verbName:'random'})
async random (ctx:RpsContext,opts:{}) : Promise<number>{
  return Math.random();
}
/**
 * @function round
 * @memberof Basic
 * @example
 * ;round
 * round 1.3
 * 
 * @returns {number} number.
 * 
 * @summary round :: Number → Number
 * 
*/
@rpsAction({verbName:'round'})
async round (ctx:RpsContext,opts:{},num:number) : Promise<number>{
  return R.apply(R.curry(Math.round),num);
}
/**
 * @function truncate
 * @memberof Basic
 * @example
 * ;trunc
 * truncate 1.3
 * 
 * @returns {number} number.
 * 
 * @summary truncate :: Number → Number
 * 
*/
@rpsAction({verbName:'truncate'})
async trunc (ctx:RpsContext,opts:{},num:number) : Promise<number>{
  return R.apply(R.curry(Math.trunc),num);
}

/**************************** Ramda (List) ***********************************/

/**
 * @function length
 * @memberof Basic
 * @example
 * ;Print out the length of the list
 * log length []
 * log length [1,2,3]
 * 
 * @param {Array} list list to be determined
 * @summary length :: [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs/#length}
*/
@rpsAction({verbName:'length'})
async length (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.length.apply(this,params);
}

}
