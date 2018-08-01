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
 * @summary print out text on console.
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
 * @function listen-once
 * @memberof Basic
 * @example
 * listen-once 'connected' $emitter
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen to event once
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
 * listen-on $emitter 'start' @ $output { console-log $output }
 * 
 * @param {EventEmitter} event The object to listen to.
 * @param {string} eventName Name to listen for event.
 * @returns {*}  If condition is met, result of exec. else null.
 * @summary listen to event once
 * 
 * @see {@link https://nodejs.org/api/events.html#events_emitter_once_eventname_listener}
 * 
*/
  @rpsAction({verbName:'listen-on'})
  async on (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string, cb:(any)=>void) : Promise<EventEmitter>{
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
 * @function stringify
 * @memberof Basic
 * @example
 * stringify $value
 * 
 * @param {Object} object 
 * @returns {string} String result
 * @summary
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
 * @param {number} number 
 * @returns {number} Absolute number.
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
*/
@rpsAction({verbName:'round'})
async round (ctx:RpsContext,opts:{},num:number) : Promise<number>{
  return R.apply(R.curry(Math.round),num);
}
/**
 * @function trunc
 * @memberof Basic
 * @example
 * ;trunc
 * trunc 1.3
 * 
 * @returns {number} number.
 * 
*/
@rpsAction({verbName:'trunc'})
async trunc (ctx:RpsContext,opts:{},num:number) : Promise<number>{
  return R.apply(R.curry(Math.trunc),num);
}

  private argMapToObj (args:any[]) : Object{
    if(!args || args.length == 0) return undefined;

    let obj = {};
    let initCharCode = 'a'.charCodeAt(0);

    for(var i =0;i<args.length;i++){
      let alphabet = String.fromCharCode(initCharCode + i);
      obj[alphabet] = args[i];
    }

    return obj;
  }


}
