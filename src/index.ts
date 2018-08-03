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
 * @function stdout
 * @memberof Basic
 * @example
 * ;print 'Hello'
 * stdout 'Hello'
 * 
 * @param {string} text information to be printed out on the terminal.
 * @returns {*}  Similar to text input.
 * @summary stdout :: a → a
 * 
 * @see {@link https://nodejs.org/api/process.html#process_process_stdout}
 * 
*/
@rpsAction({verbName:'stdout'})
async stdout(ctx:RpsContext,opts:{}, text?:any) : Promise<any>{
  if(text){
    process.stdout.write(text);
    return text;
  }
  else {
    return function (txt) {
      process.stdout.write(txt);
      return txt;
    }
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
  listenOnce (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string) : Promise<any>{
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

  /***
 * @function wait
 * @memberof Basic
 * @example
 * ;wait for 5 second
 * wait 5
 * 
 * @param {number} period Period to wait for in second.
 * @param {*} output returned output after period second.
 * @returns {*} Previous result.
 * @summary wait :: Number → a → a
 * 
*/
  @rpsAction({verbName:'wait'})
  async wait (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any>{
    // response = response ? response : ctx.$RESULT;
    // period:number, response?:any

    let sleep = R.curry(function(period, res) {
      let time = period * 1000;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time);

      return res;
    });

    return R.apply(sleep,params);
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
async mathMax (ctx:RpsContext,opts:{}, ...num:number[]) : Promise<number>{
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
async mathMin (ctx:RpsContext,opts:{}, ...num:number[]) : Promise<number>{
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
 * @function adjust
 * @memberof Basic
 * @example
 * adjust (add 10) 1 [1,2,3]
 * 
 * @param {Function} function
 * @param {Number} number
 * @param {Array} array
 * @summary adjust :: (a → a) → Number → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#adjust}
*/
@rpsAction({verbName:'adjust'})
async adjust (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.adjust.apply(this,params);
}


  /**
 * @function all
 * @memberof Basic
 * @example
 * all (equals 3) [3, 3, 3, 3]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary all :: (a → Boolean) → [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#all}
*/
@rpsAction({verbName:'all'})
async all (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.all.apply(this,params);
}

/**
 * @function any
 * @memberof Basic
 * @example
 * any (equals 1) [1,2]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary any :: (a → Boolean) → [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#any}
*/
@rpsAction({verbName:'any'})
async any (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.any.apply(this,params);
}

/**
 * @function aperture
 * @memberof Basic
 * @example
 * aperture 2 [1,2,3,4,5]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary aperture :: Number → [a] → [[a]]
 * 
 * @see {@link https://ramdajs.com/docs#aperture}
*/
@rpsAction({verbName:'aperture'})
async aperture (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.aperture.apply(this,params);
}

/**
 * @function append
 * @memberof Basic
 * @example
 * append "tests" ["hello"]
 * 
 * @param {*} any
 * @param {Array} array
 * @summary append :: a → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#append}
*/
@rpsAction({verbName:'append'})
async append (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.append.apply(this,params);
}

/**
 * @function chain
 * @memberof Basic
 * @example
 * TODO:
 * 
 * @param {*} TODO
 * @param {Array} TODO
 * @summary chain :: Chain m => (a → m b) → m a → m b
 * 
 * @see {@link https://ramdajs.com/docs#chain}
*/
@rpsAction({verbName:'chain'})
async chain (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.chain.apply(this,params);
}

/**
 * @function concat
 * @memberof Basic
 * @example
 * concat "hello" "world"
 * 
 * @param {*} any
 * @param {*} any
 * @summary concat :: [a] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#concat}
*/
@rpsAction({verbName:'concat'})
async concat (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.concat.apply(this,params);
}

/**
 * @function contains
 * @memberof Basic
 * @example
 * contains 3 [1,2,3]
 * 
 * @param {*} any
 * @param {Array} array
 * @summary contains :: a → [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#contains}
*/
@rpsAction({verbName:'contains'})
async contains (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.contains.apply(this,params);
}

/**
 * @function drop
 * @memberof Basic
 * @example
 * drop 1 [1,2,3]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary drop :: Number → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#drop}
*/
@rpsAction({verbName:'drop'})
async drop (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.drop.apply(this,params);
}

/**
 * @function drop-last
 * @memberof Basic
 * @example
 * drop-last 1 [1,2,3]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary drop-last :: Number → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#dropLast}
*/
@rpsAction({verbName:'drop-last'})
async dropLast (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dropLast.apply(this,params);
}

/**
 * @function drop-last-while
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary drop-last-while :: (a → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#dropLastWhile}
*/
@rpsAction({verbName:'drop-last-while'})
async dropLastWhile (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dropLastWhile.apply(this,params);
}

/**
 * @function drop-repeats
 * @memberof Basic
 * @example
 * drop-repeats [1,1,1,2,3,4,4,4,2,2]
 * 
 * @param {Array} array
 * @summary drop-repeats :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#dropRepeats}
*/
@rpsAction({verbName:'drop-repeats'})
async dropRepeats (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  //@ts-ignore
  return R.dropRepeats.apply(this,params);
}

/**
 * @function drop-repeats-with
 * @memberof Basic
 * @example
 * drop-repeats-with (eq-by abs) [1,-1,3,-4,-4]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary drop-repeats-with :: ((a,a) → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#dropRepeatsWith}
*/
@rpsAction({verbName:'drop-repeats-with'})
async dropRepeatsWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  //@ts-ignore
  return R.dropRepeatsWith.apply(this,params);
}

/**
 * @function drop-while
 * @memberof Basic
 * @example
 * drop-while (eq-by abs) [1,-1,3,-4,-4]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary drop-while :: (a → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#dropWhile}
*/
@rpsAction({verbName:'drop-while'})
async dropWhile (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dropWhile.apply(this,params);
}

/**
 * @function ends-with
 * @memberof Basic
 * @example
 * ends-with 'c' 'abc'
 * 
 * @param {Array} array
 * @summary ends-with :: [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#endsWith}
*/
@rpsAction({verbName:'ends-with'})
async endsWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.endsWith.apply(this,params);
}

/**
 * @function filter
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary filter :: Filterable f => (a → Boolean) → f a → f a
 * 
 * @see {@link https://ramdajs.com/docs#filter}
*/
@rpsAction({verbName:'filter'})
filter (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any[]> {
  return R.filter.apply(this,params);
}


/**
 * @function find
 * @memberof Basic
 * @example
 * find (prop-eq 'a' 2) [{'a':1},{'a':2},{'a':3}]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary find :: (a → Boolean) → [a] → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#find}
*/
@rpsAction({verbName:'find'})
async find (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.find.apply(this,params);
}

/**
 * @function find-index
 * @memberof Basic
 * @example
 * find-index (prop-eq 'a' 2) [{'a':1},{'a':2},{'a':3}]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary find-index :: (a → Boolean) → [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs#findIndex}
*/
@rpsAction({verbName:'find-index'})
async findIndex (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.findIndex.apply(this,params);
}

/**
 * @function find-last
 * @memberof Basic
 * @example
 * find-last (prop-eq 'a' 2) [{'a':1},{'a':2},{'a':3}]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary find :: (a → Boolean) → [a] → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#findLast}
*/
@rpsAction({verbName:'find-last'})
async findLast (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.findLast.apply(this,params);
}

/**
 * @function find-last-index
 * @memberof Basic
 * @example
 * find-last-index (prop-eq 'a' 2) [{'a':1},{'a':2},{'a':3}]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary find-index :: (a → Boolean) → [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs#findLastIndex}
*/
@rpsAction({verbName:'find-last-index'})
async findLastIndex (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.findLastIndex.apply(this,params);
}

/**
 * @function flatten
 * @memberof Basic
 * @example
 * flatten [1,2,[3,4]]
 * 
 * @param {Array} array
 * @summary flatten :: [a] → [b]
 * 
 * @see {@link https://ramdajs.com/docs#flatten}
*/
@rpsAction({verbName:'flatten'})
async flatten (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.flatten.apply(this,params);
}

/**
 * @function for-each
 * @memberof Basic
 * @example
 * for-each (log) [1,2,3,4]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary for-each :: (a → *) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#forEach}
*/
@rpsAction({verbName:'for-each'})
async forEach (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.forEach.apply(this,params);
}

/**
 * @function from-pairs
 * @memberof Basic
 * @example
 * from-pairs [['a',1],['b',2],['c',3]]
 * 
 * @param {Array} array
 * @summary from-pairs :: [[k,v]] → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#fromPairs}
*/
@rpsAction({verbName:'from-pairs'})
async fromPairs (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.fromPairs.apply(this,params);
}

/**
 * @function group-by
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Array} array
 * @summary group-by :: ((a → String) → [a] → {String:[a]}
 * 
 * @see {@link https://ramdajs.com/docs#groupBy}
*/
@rpsAction({verbName:'group-by'})
async groupBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.groupBy.apply(this,params);
}

/**
 * @function group-with
 * @memberof Basic
 * @example
 * group-with (equals) [0,1,1,2,3,4,6,4]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary group-with :: ((a,a) → Boolean) → [a] → [[a]]
 * 
 * @see {@link https://ramdajs.com/docs#groupWith}
*/
@rpsAction({verbName:'group-with'})
async groupWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.groupWith.apply(this,params);
}

/**
 * @function head
 * @memberof Basic
 * @example
 * head ['ff',''aa','lol']
 * 
 * @param {Array} array
 * @summary head :: [a] → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#head}
*/
@rpsAction({verbName:'head'})
async head (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.head.apply(this,params);
}

/**
 * @function index-of
 * @memberof Basic
 * @example
 * index-of 3 [1,2,3,4]
 * 
 * @param {*} any
 * @param {Array} array
 * @summary index-of :: a → [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs#indexOf}
*/
@rpsAction({verbName:'index-of'})
async indexOf (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.indexOf.apply(this,params);
}

/**
 * @function index-by
 * @memberof Basic
 * @example
 * index-by (prop 'id') [{'id':'abc','title':'A'},{'id':'xyz','title':'B'}]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary index-by :: (a → String) → [{k:v}] → {:{k:v}}
 * 
 * @see {@link https://ramdajs.com/docs#indexBy}
*/
@rpsAction({verbName:'index-by'})
async indexBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.indexBy.apply(this,params);
}

/**
 * @function init
 * @memberof Basic
 * @example
 * init [1, 2, 3]
 * 
 * @param {Array} array
 * @summary index-by :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#init}
*/
@rpsAction({verbName:'init'})
async init (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.init.apply(this,params);
}

/**
 * @function insert
 * @memberof Basic
 * @example
 * insert 2 'x' [1,2,3,4]
 * 
 * @param {Number} number
 * @param {*} any
 * @param {Array} array
 * @summary insert :: Number → a → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#insert}
*/
@rpsAction({verbName:'insert'})
async insert (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.insert.apply(this,params);
}

/**
 * @function insert-all
 * @memberof Basic
 * @example
 * insert-all 2 ['x','y','z'] [1,2,3,4]
 * 
 * @param {Number} number
 * @param {Array} array
 * @param {Array} array
 * @summary insert-all :: Number → [a] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#insertAll}
*/
@rpsAction({verbName:'insert-all'})
async insertAll (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.insertAll.apply(this,params);
}

/**
 * @function intersperse
 * @memberof Basic
 * @example
 * intersperse 'n' ['x','y','z']
 * 
 * @param {*} any
 * @param {Array} array
 * @summary intersperse :: a → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#intersperse}
*/
@rpsAction({verbName:'intersperse'})
async intersperse (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.intersperse.apply(this,params);
}

/**
 * @function join
 * @memberof Basic
 * @example
 * join ' ' ['x','y','z']
 * 
 * @param {String} string
 * @param {Array} array
 * @summary join :: String → [a] → String
 * 
 * @see {@link https://ramdajs.com/docs#join}
*/
@rpsAction({verbName:'join'})
async join (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.join.apply(this,params);
}

/**
 * @function last
 * @memberof Basic
 * @example
 * last ['x','y','z']
 * 
 * @param {Array} array
 * @summary last :: [a] → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#last}
*/
@rpsAction({verbName:'last'})
async last (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.last.apply(this,params);
}

/**
 * @function last-index-of
 * @memberof Basic
 * @example
 * last-index-of 'y' ['x','y','y','z']
 * 
 * @param {Array} array
 * @summary last-index-of :: a → [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs#lastIndexOf}
*/
@rpsAction({verbName:'last-index-of'})
async lastIndexOf (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lastIndexOf.apply(this,params);
}

/**
 * @function length
 * @memberof Basic
 * @example
 * length [1,2,3]
 * 
 * @param {Array} array
 * @summary length :: [a] → Number
 * 
 * @see {@link https://ramdajs.com/docs/#length}
*/
@rpsAction({verbName:'length'})
async length (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.length.apply(this,params);
}


/**
 * @function map
 * @memberof Basic
 * @example
 * map (multiple 2) [1,2,3]
 * 
 * @param {Function} function 
 * @param {Array} list 
 * @summary map :: Functor f => (a → b) → f a → f b
 * 
 * @see {@link https://ramdajs.com/docs#map}
*/
@rpsAction({verbName:'map'})
map (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any[]> {
  return R.map.apply(this,params);
}

/**
 * @function map-accum
 * @memberof Basic
 * @example
 * map-accum (multiple 2) [1,2,3]
 * 
 * @param {Function} function 
 * @param {Array} list 
 * @summary map-accum :: ((acc,x) → (acc,y)) → acc → [x] → (acc, [y])
 * 
 * @see {@link https://ramdajs.com/docs#mapAccum}
*/
@rpsAction({verbName:'map-accum'})
async mapAccum (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mapAccum.apply(this,params);
}

/**
 * @function map-accum-right
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function 
 * @param {Array} list 
 * @summary map-accum-right :: ((acc,x) → (acc,y)) → acc → [x] → ([y],acc)
 * 
 * @see {@link https://ramdajs.com/docs#mapAccumRight}
*/
@rpsAction({verbName:'map-accum-right'})
async mapAccumRight (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mapAccumRight.apply(this,params);
}

/**
 * @function merge-all
 * @memberof Basic
 * @example
 * merge-all [{'foo':1},{'bar':2},{'baz':3}]
 * 
 * @param {Array} list 
 * @summary merge-all :: [{k:v}] → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#mergeAll}
*/
@rpsAction({verbName:'merge-all'})
async mergeAll (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeAll.apply(this,params);
}

/**
 * @function none
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary none :: (a → Boolean) → [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#none}
*/
@rpsAction({verbName:'none'})
async none (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.none.apply(this,params);
}

/**
 * @function nth
 * @memberof Basic
 * @example
 * nth 1 ['a','b','c']
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary nth :: Number → [a] → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#nth}
*/
@rpsAction({verbName:'nth'})
async nth (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.nth.apply(this,params);
}

/**
 * @function pair
 * @memberof Basic
 * @example
 * pair 'foo' 'bar'
 * 
 * @param {*} any
 * @param {*} any
 * @summary pair :: a → b → (a,b)
 * 
 * @see {@link https://ramdajs.com/docs#pair}
*/
@rpsAction({verbName:'pair'})
async pair (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pair.apply(this,params);
}

/**
 * @function partition
 * @memberof Basic
 * @example
 * partition (contains 's') ['sss','ttt','sas','abc']
 * 
 * @param {Function} function
 * @param {Array|Object} array or object
 * @summary partition :: Filterable f => (a → Boolean) → f a → [f a, f a]
 * 
 * @see {@link https://ramdajs.com/docs#partition}
*/
@rpsAction({verbName:'partition'})
async partition (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.partition.apply(this,params);
}

/**
 * @function pluck
 * @memberof Basic
 * @example
 * pluck (prop 'a') [{a:1},{a:2}]
 * 
 * @param {Function} function
 * @param {Array|Object} array or object
 * @summary pluck :: Functor f => k → f {k:v} → f v
 * 
 * @see {@link https://ramdajs.com/docs#pluck}
*/
@rpsAction({verbName:'pluck'})
async pluck (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pluck.apply(this,params);
}

/**
 * @function prepend
 * @memberof Basic
 * @example
 * prepend 'fee' ['fi','fo','fum']
 * 
 * @param {*} any
 * @param {Array} array
 * @summary prepend :: a → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#prepend}
*/
@rpsAction({verbName:'prepend'})
async prepend (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.prepend.apply(this,params);
}

/**
 * @function range
 * @memberof Basic
 * @example
 * range 1 5
 * 
 * @param {Number} number
 * @param {Number} number
 * @summary range :: Number → Number → [Number]
 * 
 * @see {@link https://ramdajs.com/docs#range}
*/
@rpsAction({verbName:'range'})
async range (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.range.apply(this,params);
}

/**
 * @function reduce
 * @memberof Basic
 * @example
 * reduce (subtract) 0 [1,2,3,4]
 * 
 * @param {Function} function
 * @param {*} any
 * @param {Array} array
 * @summary reduce :: ((a,b) → a) → a → [b] → a
 * 
 * @see {@link https://ramdajs.com/docs#reduce}
*/
@rpsAction({verbName:'reduce'})
async reduce (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reduce.apply(this,params);
}

/**
 * @function reduce-by
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary reduce-by :: ((a,b) → a) → a → (b → String) → [b] → {String:a}
 * 
 * @see {@link https://ramdajs.com/docs#reduceBy}
*/
@rpsAction({verbName:'reduce-by'})
async reduceBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reduceBy.apply(this,params);
}

/**
 * @function reduce-right
 * @memberof Basic
 * @example
 * reduce-right (subtract) 0 [1,2,3,4]
 * 
 * @param {Function} function
 * @param {*} any
 * @param {Array} array
 * @summary reduce :: ((a,b) → b) → b → [a] → b
 * 
 * @see {@link https://ramdajs.com/docs#reduceRight}
*/
@rpsAction({verbName:'reduce-right'})
async reduceRight (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reduceRight.apply(this,params);
}

/**
 * @function reduce-while
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary reduce-while :: ((a,b) → Boolean) → ((a,b) → a) → a → [b] → a
 * 
 * @see {@link https://ramdajs.com/docs#reduceWhile}
*/
@rpsAction({verbName:'reduce-while'})
async reduceWhile (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reduceWhile.apply(this,params);
}

/**
 * @function reject
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary reject :: Filterable f => (a → Boolean) → f a → f a
 * 
 * @see {@link https://ramdajs.com/docs#reject}
*/
@rpsAction({verbName:'reject'})
async reject (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reject.apply(this,params);
}

/**
 * @function remove
 * @memberof Basic
 * @example
 * remove 2 3 [1,2,3,4,5,6,7,8]
 * 
 * @param {Number} number
 * @param {Number} number
 * @param {Array} array
 * @summary remove :: Number → Number → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#remove}
*/
@rpsAction({verbName:'remove'})
async remove (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.remove.apply(this,params);
}

/**
 * @function repeat
 * @memberof Basic
 * @example
 * repeat "hi" 5
 * 
 * @param {*} any
 * @param {Number} number
 * @summary repeat :: a → n → [a]
 * 
 * @see {@link https://ramdajs.com/docs#repeat}
*/
@rpsAction({verbName:'repeat'})
async repeat (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.repeat.apply(this,params);
}

/**
 * @function reverse
 * @memberof Basic
 * @example
 * reverse [1,2,3]
 * 
 * @param {Array} array
 * @summary reverse :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#reverse}
*/
@rpsAction({verbName:'reverse'})
async reverse (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.reverse.apply(this,params);
}

/**
 * @function scan
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary scan :: ((a,b) → a) → a → [b] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#scan}
*/
@rpsAction({verbName:'scan'})
async scan (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.scan.apply(this,params);
}

/**
 * @function slice
 * @memberof Basic
 * @example
 * slice 1 3 ['a','b','c','d']
 * 
 * @param {Number} number
 * @param {Number} number
 * @param {*} any
 * @summary slice :: Number → Number → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#slice}
*/
@rpsAction({verbName:'slice'})
async slice (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.slice.apply(this,params);
}

/**
 * @function sort
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary sort :: ((a,a) → Number) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#sort}
*/
@rpsAction({verbName:'sort'})
async sort (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.sort.apply(this,params);
}

/**
 * @function split-at
 * @memberof Basic
 * @example
 * split-at 1 [1,2,3]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary split-at :: Number → [a] → [[a],[a]]
 * 
 * @see {@link https://ramdajs.com/docs#splitAt}
*/
@rpsAction({verbName:'split-at'})
async splitAt (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.splitAt.apply(this,params);
}

/**
 * @function split-every
 * @memberof Basic
 * @example
 * split-every 3 [1,2,3,4,5,6,7]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary split-every :: Number → [a] → [[a]]
 * 
 * @see {@link https://ramdajs.com/docs#splitEvery}
*/
@rpsAction({verbName:'split-every'})
async splitEvery (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.splitEvery.apply(this,params);
}

/**
 * @function split-when
 * @memberof Basic
 * @example
 * split-when (equals 3) [1,2,3,4,5,6,7]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary split-when :: (a → Boolean) → [a] → [[a],[a]]
 * 
 * @see {@link https://ramdajs.com/docs#splitWhen}
*/
@rpsAction({verbName:'split-when'})
async splitWhen (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.splitWhen.apply(this,params);
}

/**
 * @function starts-with
 * @memberof Basic
 * @example
 * starts-with 'a' 'abc'
 * 
 * @param {*} any
 * @param {Array} array
 * @summary starts-with :: [a] → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#startsWith}
*/
@rpsAction({verbName:'starts-with'})
async startsWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.startsWith.apply(this,params);
}

/**
 * @function tail
 * @memberof Basic
 * @example
 * tail [1,2,3]
 * 
 * @param {Array} array
 * @summary tail :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#tail}
*/
@rpsAction({verbName:'tail'})
async tail (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.tail.apply(this,params);
}

/**
 * @function take
 * @memberof Basic
 * @example
 * take 2 [1,2,3]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary take :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#take}
*/
@rpsAction({verbName:'take'})
async take (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.take.apply(this,params);
}

/**
 * @function take-last
 * @memberof Basic
 * @example
 * take-last 2 [1,2,3]
 * 
 * @param {Number} number
 * @param {Array} array
 * @summary take-last :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#takeLast}
*/
@rpsAction({verbName:'take-last'})
async takeLast (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.takeLast.apply(this,params);
}

/**
 * @function take-last-while
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary take-last-while :: (a → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#takeLastWhile}
*/
@rpsAction({verbName:'take-last-while'})
async takeLastWhile (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.takeLastWhile.apply(this,params);
}

/**
 * @function take-while
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary take-while :: (a → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#takeWhile}
*/
@rpsAction({verbName:'take-while'})
async takeWhile (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.takeWhile.apply(this,params);
}

/**
 * @function times
 * @memberof Basic
 * @example
 * times (identity) 5
 * 
 * @param {Function} function
 * @param {Number} number
 * @summary times :: (Number → a) → Number → [a]
 * 
 * @see {@link https://ramdajs.com/docs#times}
*/
@rpsAction({verbName:'times'})
async times (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.times.apply(this,params);
}

/**
 * @function transpose
 * @memberof Basic
 * @example
 * transpose [[1,'a'],[2,'b'],[3,'c']]
 * 
 * @param {Array} array
 * @summary transpose :: [[a]] → [[a]]
 * 
 * @see {@link https://ramdajs.com/docs#transpose}
*/
@rpsAction({verbName:'transpose'})
async transpose (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.transpose.apply(this,params);
}

/**
 * @function unfold
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary unfold :: (a → [b]) → * → [b]
 * 
 * @see {@link https://ramdajs.com/docs#unfold}
*/
@rpsAction({verbName:'unfold'})
async unfold (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.unfold.apply(this,params);
}

/**
 * @function uniq
 * @memberof Basic
 * @example
 * uniq [1,2,3,3,4,5,4]
 * 
 * @param {Array} array
 * @summary uniq :: [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#uniq}
*/
@rpsAction({verbName:'uniq'})
async uniq (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.uniq.apply(this,params);
}

/**
 * @function uniq-by
 * @memberof Basic
 * @example
 * uniq-by (abs) [-1, -5, 2, 10, 1, 2]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary uniq-by :: (a → b) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#uniqBy}
*/
@rpsAction({verbName:'uniq-by'})
async uniqBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.uniqBy.apply(this,params);
}

/**
 * @function uniq-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary uniq-with :: ((a,a) → Boolean) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#uniqWith}
*/
@rpsAction({verbName:'uniq-with'})
async uniqWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.uniqWith.apply(this,params);
}

/**
 * @function unnest
 * @memberof Basic
 * @example
 * unnest  [1 , [2], [[3]]]
 * 
 * @param {Array} array
 * @summary unnest :: Chain c => c (c a) → c a
 * 
 * @see {@link https://ramdajs.com/docs#unnest}
*/
@rpsAction({verbName:'unnest'})
async unnest (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.unnest.apply(this,params);
}

/**
 * @function update
 * @memberof Basic
 * @example
 * update 1 11 [0,1,2]
 * 
 * @param {Number} number
 * @param {*} any
 * @param {Array} array
 * @summary update :: Number → a → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#update}
*/
@rpsAction({verbName:'update'})
async update (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.update.apply(this,params);
}

/**
 * @function without
 * @memberof Basic
 * @example
 * without [1,2] [1,2,1,3,4]
 * 
 * @param {Array} array
 * @param {Array} array
 * @summary without :: [a] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#without}
*/
@rpsAction({verbName:'without'})
async without (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.without.apply(this,params);
}

/**
 * @function xprod
 * @memberof Basic
 * @example
 * xprod [1,2] ['a','b']
 * 
 * @param {Array} array
 * @param {Array} array
 * @summary xprod :: [a] → [b] → [[a,b]]
 * 
 * @see {@link https://ramdajs.com/docs#xprod}
*/
@rpsAction({verbName:'xprod'})
async xprod (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.xprod.apply(this,params);
}

/**
 * @function zip
 * @memberof Basic
 * @example
 * zip [1,2,3] ['a','b','c']
 * 
 * @param {Array} array
 * @param {Array} array
 * @summary zip :: [a] → [b] → [[a,b]]
 * 
 * @see {@link https://ramdajs.com/docs#zip}
*/
@rpsAction({verbName:'zip'})
async zip (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.zip.apply(this,params);
}

/**
 * @function zip-obj
 * @memberof Basic
 * @example
 * zip-obj ['a','b','c'] [1,2,3]
 * 
 * @param {Array} array
 * @param {Array} array
 * @summary zip-obj :: [String] → [*] → {String:*}
 * 
 * @see {@link https://ramdajs.com/docs#zipObj}
*/
@rpsAction({verbName:'zip-obj'})
async zipObj (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.zipObj.apply(this,params);
}


/**
 * @function zip-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @param {Array} array
 * @summary zip-with :: ((a,b) → c) [a] → [b] → [c]
 * 
 * @see {@link https://ramdajs.com/docs#zipWith}
*/
@rpsAction({verbName:'zip-with'})
async zipWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.zipWith.apply(this,params);
}

/**************************** Ramda (Object) ***********************************/

/**
 * @function keys
 * @memberof Basic
 * @example
 * keys {a:1,b:2,c:3}
 * 
 * @param {Objects} object
 * @summary keys :: {k:v} → [k]
 * 
 * @see {@link https://ramdajs.com/docs#keys}
*/
@rpsAction({verbName:'keys'})
async keys (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.keys.apply(this,params);
}

/**
 * @function assoc
 * @memberof Basic
 * @example
 * assoc 'd' 4 {a:1,b:2,c:3}
 * 
 * @param {String} string
 * @param {*} any
 * @param {Objects} object
 * @summary assoc :: String → a → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#assoc}
*/
@rpsAction({verbName:'assoc'})
async assoc (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.assoc.apply(this,params);
}

/**
 * @function assoc-path
 * @memberof Basic
 * @example
 * assoc-path ['c','d'] 4 {a:1,b:2,c:{d:0}}
 * 
 * @param {Array} array
 * @param {*} any
 * @param {Objects} object
 * @summary assoc-path :: [Idx] → a → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#assocPath}
*/
@rpsAction({verbName:'assoc-path'})
async assocPath (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.assocPath.apply(this,params);
}

/**
 * @function clone
 * @memberof Basic
 * @example
 * clone {a:1}
 * 
 * @param {Objects} object
 * @summary clone :: {*} → {*}
 * 
 * @see {@link https://ramdajs.com/docs#clone}
*/
@rpsAction({verbName:'clone'})
async clone (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.clone.apply(this,params);
}

/**
 * @function dissoc
 * @memberof Basic
 * @example
 * dissoc 'b' {a:1,b:2,c:3}
 * 
 * @param {String} string
 * @param {Objects} object
 * @summary assoc :: String → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#dissoc}
*/
@rpsAction({verbName:'dissoc'})
async dissoc (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dissoc.apply(this,params);
}

/**
 * @function dissoc-path
 * @memberof Basic
 * @example
 * dissoc-path ['c','d'] 4 {a:1,b:2,c:{d:5}}
 * 
 * @param {Array} array
 * @param {Objects} object
 * @summary assoc-path :: [Idx] → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#dissocPath}
*/
@rpsAction({verbName:'dissoc-path'})
async dissocPath (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dissocPath.apply(this,params);
}

/**
 * @function eq-props
 * @memberof Basic
 * @example
 * eq-props 'a' {a:1} {a:1}
 * 
 * @param {String} string
 * @param {Objects} object
 * @param {Objects} object
 * @summary eq-props :: k → {k:v} → {k:v} →  Boolean
 * 
 * @see {@link https://ramdajs.com/docs#eqProps}
*/
@rpsAction({verbName:'eq-props'})
async eqProps (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.eqProps.apply(this,params);
}

/**
 * @function evolve
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary evolve :: {k: (v → v)} → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#evolve}
*/
@rpsAction({verbName:'evolve'})
async evolve (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.evolve.apply(this,params);
}

/**
 * @function for-each-obj-indexed
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary for-each-obj-indexed :: ((a,String,StrMap a)  → Any) → StrMap a → StrMap a
 * 
 * @see {@link https://ramdajs.com/docs#forEachObjIndexed}
*/
@rpsAction({verbName:'for-each-obj-indexed'})
async forEachObjIndexed (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.forEachObjIndexed.apply(this,params);
}

/**
 * @function has
 * @memberof Basic
 * @example
 * has 'name' {name:'Alice'}
 * 
 * @param {String} string
 * @param {Object} object
 * @summary has :: s → {s:x} → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#has}
*/
@rpsAction({verbName:'has'})
async has (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.has.apply(this,params);
}


/**
 * @function invert
 * @memberof Basic
 * @example
 * invert {first:'Alice',second:'allen',third:'Alice'}
 * 
 * @param {Object} object
 * @summary invert :: {s:x} → {x:[s,...]}
 * 
 * @see {@link https://ramdajs.com/docs#invert}
*/
@rpsAction({verbName:'invert'})
async invert (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.invert.apply(this,params);
}

/**
 * @function invert-obj
 * @memberof Basic
 * @example
 * invert-obj {first:'Alice',second:'allen'}
 * 
 * @param {Object} object
 * @summary invert-obj :: {s:x} → {x:s}
 * 
 * @see {@link https://ramdajs.com/docs#invertObj}
*/
@rpsAction({verbName:'invert-obj'})
async invertObj (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.invertObj.apply(this,params);
}


/**
 * @function lens
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#lens}
*/
@rpsAction({verbName:'lens'})
async lens (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lens.apply(this,params);
}

/**
 * @function lens-index
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#lensIndex}
*/
@rpsAction({verbName:'lens-index'})
async lensIndex (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lensIndex.apply(this,params);
}

/**
 * @function lens-path
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#lensPath}
*/
@rpsAction({verbName:'lens-path'})
async lensPath (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lensPath.apply(this,params);
}

/**
 * @function lens-prop
 * @memberof Basic
 * @example
 * TODO
 * @see {@link https://ramdajs.com/docs#lensProp}
*/
@rpsAction({verbName:'lens-prop'})
async lensProp (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lensProp.apply(this,params);
}

/**
 * @function map-obj-indexed
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary map-obj-indexed :: ((*,String,Object)→ *) → Object → Object
 * 
 * @see {@link https://ramdajs.com/docs#mapObjIndexed}
*/
@rpsAction({verbName:'map-obj-indexed'})
async mapObjIndexed (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mapObjIndexed.apply(this,params);
}

/**
 * @function merge
 * @memberof Basic
 * @example
 * merge {name:'fred',age:10} {age:40}
 * 
 * @param {Object} object
 * @param {Object} object
 * @summary merge :: {k:v} → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#merge}
*/
@rpsAction({verbName:'merge'})
async merge (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.merge.apply(this,params);
}

/**
 * @function merge-deep-left
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary merge-deep-left :: {a} → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#mergeDeepLeft}
*/
@rpsAction({verbName:'merge-deep-left'})
async mergeDeepLeft (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeDeepLeft.apply(this,params);
}

/**
 * @function merge-deep-right
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary merge :: {a} → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#mergeDeepRight}
*/
@rpsAction({verbName:'merge-deep-right'})
async mergeDeepRight (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeDeepRight.apply(this,params);
}

/**
 * @function merge-deep-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary merge-deep-with :: ((a,a) → a) → {a} → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#mergeDeepWith}
*/
@rpsAction({verbName:'merge-deep-with'})
async mergeDeepWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeDeepWith.apply(this,params);
}

/**
 * @function merge-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary merge-deep-with :: ((a,a) → a) → {a} → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#mergeWith}
*/
@rpsAction({verbName:'merge-with'})
async mergeWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeWith.apply(this,params);
}

/**
 * @function merge-with-key
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary merge-with-key :: ((String, a,a) → a) → {a} → {a} → {a}
 * 
 * @see {@link https://ramdajs.com/docs#mergeWithKey}
*/
@rpsAction({verbName:'merge-with-key'})
async mergeWithKey (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mergeWithKey.apply(this,params);
}

/**
 * @function obj-of
 * @memberof Basic
 * @example
 * obj-of 'must' ['a','b','c']
 * 
 * @param {String} string
 * @param {*} any
 * @summary obj-of :: String → a → {String:a}
 * 
 * @see {@link https://ramdajs.com/docs#objOf}
*/
@rpsAction({verbName:'obj-of'})
async objOf (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.objOf.apply(this,params);
}

/**
 * @function omit
 * @memberof Basic
 * @example
 * omit ['a','b'] {a:1,b:2,c:3,d:4}
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary omit :: [String] → {String:*} → {String:*}
 * 
 * @see {@link https://ramdajs.com/docs#omit}
*/
@rpsAction({verbName:'omit'})
async omit (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.omit.apply(this,params);
}

/**
 * @function over
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#over}
*/
@rpsAction({verbName:'over'})
async over (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.over.apply(this,params);
}

/**
 * @function path
 * @memberof Basic
 * @example
 * path ['a','b'] {a:1,{b:2}}
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary path :: [Idx] → {a} → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#path}
*/
@rpsAction({verbName:'path'})
async path (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.path.apply(this,params);
}

/**
 * @function path-or
 * @memberof Basic
 * @example
 * path-or 'N/A' ['a','b'] {a:1,{b:2}}
 * 
 * @param {String} string
 * @param {Array} array
 * @param {Object} object
 * @summary path-or :: a → [Idx] → {a} → a
 * 
 * @see {@link https://ramdajs.com/docs#pathOr}
*/
@rpsAction({verbName:'path-or'})
async pathOr (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pathOr.apply(this,params);
}

/**
 * @function pick
 * @memberof Basic
 * @example
 * pick ['a','b'] {a:1,b:2,c:3,d:4}
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary pick :: [k] → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#pick}
*/
@rpsAction({verbName:'pick'})
async pick (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pick.apply(this,params);
}

/**
 * @function pick-all
 * @memberof Basic
 * @example
 * pick-all ['a','b','g'] {a:1,b:2,c:3,d:4}
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary pick-all :: [k] → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#pickAll}
*/
@rpsAction({verbName:'pick-all'})
async pickAll (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pickAll.apply(this,params);
}

/**
 * @function pick-by
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Object} object
 * @summary pick-by :: ((v,k) → Boolean) → {k:v} → {k:v}
 * 
 * @see {@link https://ramdajs.com/docs#pickBy}
*/
@rpsAction({verbName:'pick-by'})
async pickBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pickBy.apply(this,params);
}

/**
 * @function project
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Array} array
 * @param {Array} array
 * @summary project :: [k] → [{k:v}] → [{k:v}]
 * 
 * @see {@link https://ramdajs.com/docs#project}
*/
@rpsAction({verbName:'project'})
async project (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.project.apply(this,params);
}

/**
 * @function prop
 * @memberof Basic
 * @example
 * prop 'x' {x:100}
 * 
 * @param {String} string
 * @param {Object} object
 * @summary prop :: s → {s:a} → a | undefined
 * 
 * @see {@link https://ramdajs.com/docs#prop}
*/
@rpsAction({verbName:'prop'})
async prop (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.prop.apply(this,params);
}

/**
 * @function prop-or
 * @memberof Basic
 * @example
 * prop-or 'N/A' 'notfound' {x:100}
 * 
 * @param {Object} object
 * @param {String} string
 * @param {Object} object
 * @summary prop-or :: a → String → Object → a
 * 
 * @see {@link https://ramdajs.com/docs#propOr}
*/
@rpsAction({verbName:'prop-or'})
async propOr (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.propOr.apply(this,params);
}

/**
 * @function props
 * @memberof Basic
 * @example
 * props ['x','y'] {x:100,y:50}
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary props :: [k] → {k:v} → [v]
 * 
 * @see {@link https://ramdajs.com/docs#props}
*/
@rpsAction({verbName:'props'})
async props (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.props.apply(this,params);
}

/**
 * @function set
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#set}
*/
@rpsAction({verbName:'set'})
async set (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.set.apply(this,params);
}

/**
 * @function to-pairs
 * @memberof Basic
 * @example
 * to-pairs {a:1,b:2,c:3}
 * 
 * @param {Object} object
 * @summary to-pairs :: {String: *} → [[String,*]]
 * 
 * @see {@link https://ramdajs.com/docs#toPairs}
*/
@rpsAction({verbName:'to-pairs'})
async toPairs (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.toPairs.apply(this,params);
}


/**
 * @function values
 * @memberof Basic
 * @example
 * values {a:1,b:2,c:3}
 * 
 * @param {Object} object
 * @summary values :: {k: v} → [v]
 * 
 * @see {@link https://ramdajs.com/docs#values}
*/
@rpsAction({verbName:'values'})
async values (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.values.apply(this,params);
}


/**
 * @function view
 * @memberof Basic
 * @example
 * TODO
 * @see {@link https://ramdajs.com/docs#view}
*/
@rpsAction({verbName:'view'})
async view (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.view.apply(this,params);
}

/**
 * @function where
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Array} array
 * @param {Object} object
 * @summary where :: {String: (* → Boolean} → {String:*} → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#where}
*/
@rpsAction({verbName:'where'})
async where (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.where.apply(this,params);
}

/**
 * @function where-eq
 * @memberof Basic
 * @example
 * where-eq {a:1,b:2} {a:1,b:2}
 * 
 * @param {Object} object
 * @param {Object} object
 * @summary where-eq :: {String:*} → {String:*} → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#whereEq}
*/
@rpsAction({verbName:'where-eq'})
async whereEq (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.whereEq.apply(this,params);
}

/**************************** Ramda (Function) ***********************************/

/**
 * @function __
 * @memberof Basic
 * 
 * @see {@link https://ramdajs.com/docs/#module.exports}
*/
@rpsAction({verbName:'__'})
async underscore (ctx:RpsContext,opts:{}) : Promise<any> {
  //@ts-ignore
  return R.__;
}

/**
 * @function add-index
 * @memberof Basic
 * @example
 * TODO
 * 
 * 
 * @see {@link https://ramdajs.com/docs#addIndex}
*/
@rpsAction({verbName:'add-index'})
async addIndex (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.addIndex.apply(this,params);
}

/**
 * @function always
 * @memberof Basic
 * @example
 * always 'Tee'
 * 
 * @param {*} any
 * @summary always :: a → (* → a)
 * 
 * @see {@link https://ramdajs.com/docs#always}
*/
@rpsAction({verbName:'always'})
async always (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.always.apply(this,params);
}

/**
 * @function ap
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#ap}
*/
@rpsAction({verbName:'ap'})
async ap (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.ap.apply(this,params);
}

/**
 * @function apply
 * @memberof Basic
 * @example
 * apply math-max [1,2,3,-99,42,6,7]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary apply :: (*... → a) → [*] → a
 * 
 * @see {@link https://ramdajs.com/docs#apply}
*/
@rpsAction({verbName:'apply'})
async apply (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.apply.apply(this,params);
}

/**
 * @function apply-spec
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#applySpec}
*/
@rpsAction({verbName:'apply-spec'})
async applySpec (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.applySpec.apply(this,params);
}

/**
 * @function apply-to
 * @memberof Basic
 * @example
 * apply-to math-max [1,2,3,-99,42,6,7]
 * 
 * @param {Function} function
 * @param {Array} array
 * @summary apply-to :: a → (a → b) → b
 * 
 * @see {@link https://ramdajs.com/docs#applyTo}
*/
@rpsAction({verbName:'apply-to'})
async applyTo (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.applyTo.apply(this,params);
}

/**
 * @function ascend
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary ascend :: Ord b => (a → b) → a → a → Number
 * 
 * @see {@link https://ramdajs.com/docs#ascend}
*/
@rpsAction({verbName:'ascend'})
async ascend (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.ascend.apply(this,params);
}

/**
 * @function call
 * @memberof Basic
 * @example
 * call add 1 2
 * 
 * @param {Function} function
 * @param {...*} any
 * 
 * @summary call :: (*... → a), *... → a
 * 
 * @see {@link https://ramdajs.com/docs#call}
*/
@rpsAction({verbName:'call'})
async call (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.call.apply(this,params);
}

/**
 * @function comparator
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * 
 * @summary comparator :: ((a,b) → Boolean) → ((a,b) → Number)
 * 
 * @see {@link https://ramdajs.com/docs#comparator}
*/
@rpsAction({verbName:'comparator'})
async comparator (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.comparator.apply(this,params);
}

/**
 * @function compose
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#compose}
*/
@rpsAction({verbName:'compose'})
async compose (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.compose.apply(this,params);
}


/**
 * @function converge
 * @memberof Basic
 * @example
 * TODO
 * 
 * 
 * @see {@link https://ramdajs.com/docs#converge}
*/
@rpsAction({verbName:'converge'})
async converge (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.converge.apply(this,params);
}

/**
 * @function descend
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary converge :: Ord b => (a → b) → a → a → Number
 * 
 * @see {@link https://ramdajs.com/docs#descend}
*/
@rpsAction({verbName:'descend'})
async descend (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.descend.apply(this,params);
}

/**
 * @function empty
 * @memberof Basic
 * @example
 * empty 'abc'
 * 
 * @param {*} any
 * @summary empty :: a → a
 * 
 * @see {@link https://ramdajs.com/docs#empty}
*/
@rpsAction({verbName:'empty'})
async empty (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.empty.apply(this,params);
}

/**
 * @function f
 * @memberof Basic
 * @example
 * f
 * 
 * @param {any} any
 * @summary * → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#F}
*/
@rpsAction({verbName:'f'})
async F (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.F.apply(this,params);
}

/**
 * @function flip
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#flip}
*/
@rpsAction({verbName:'flip'})
async flip (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.flip.apply(this,params);
}

/**
 * @function identity
 * @memberof Basic
 * @example
 * identity 1
 * 
 * @param {any} any
 * @summary a → a
 * 
 * @see {@link https://ramdajs.com/docs#identity}
*/
@rpsAction({verbName:'identity'})
async identity (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.identity.apply(this,params);
}


/**
 * @function juxt
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#juxt}
*/
@rpsAction({verbName:'juxt'})
async juxt (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.juxt.apply(this,params);
}

/**
 * @function lift
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary (*... → *) → ([*]... → [*])
 * 
 * @see {@link https://ramdajs.com/docs#lift}
*/
@rpsAction({verbName:'lift'})
async lift (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lift.apply(this,params);
}

/**
 * @function lift-n
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary Number → (*... → *) → ([*]... → [*])
 * 
 * @see {@link https://ramdajs.com/docs#liftN}
*/
@rpsAction({verbName:'lift-n'})
async liftN (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.liftN.apply(this,params);
}

/**
 * @function nth-arg
 * @memberof Basic
 * @example
 * nth 1 'a' 'b' 'c'
 * 
 * @param {Number} number
 * @param {List} list
 * 
 * @summary Number → *...  → *
 * 
 * @see {@link https://ramdajs.com/docs#nthArg}
*/
@rpsAction({verbName:'nth-arg'})
async nthArg (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.nthArg.apply(this,params);
}

/**
 * @function o
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#o}
*/
@rpsAction({verbName:'o'})
async o (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  //@ts-ignore
  return R.o.apply(this,params);
}

/**
 * @function of
 * @memberof Basic
 * @example
 * of 42
 * 
 * @param {*} any
 * 
 * @summary a → [a]
 * 
 * @see {@link https://ramdajs.com/docs#of}
*/
@rpsAction({verbName:'of'})
async of (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.of.apply(this,params);
}

/**
 * @function once
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#once}
*/
@rpsAction({verbName:'once'})
async once (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.once.apply(this,params);
}

/**
 * @function partial
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#partial}
*/
@rpsAction({verbName:'partial'})
async partial (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.partial.apply(this,params);
}

/**
 * @function partial-right
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#partialRight}
*/
@rpsAction({verbName:'partial-right'})
async partialRight (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.partialRight.apply(this,params);
}

/**
 * @function pipe
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#pipe}
*/
@rpsAction({verbName:'pipe'})
async pipe (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pipe.apply(this,params);
}

/**
 * @function t
 * @memberof Basic
 * @example
 * t
 * 
 * @param {*} any
 * 
 * @summary * → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#T}
*/
@rpsAction({verbName:'t'})
async t (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.T.apply(this,params);
}

/**
 * @function tap
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Functon} function
 * @param {Number} number
 * @summary (a → *) → a → a
 * @see {@link https://ramdajs.com/docs#tap}
*/
@rpsAction({verbName:'tap'})
async tap (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.tap.apply(this,params);
}

/**
 * @function try-catch
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#tryCatch}
*/
@rpsAction({verbName:'try-catch'})
async tryCatch (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.tryCatch.apply(this,params);
}


/**
 * @function use-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#useWith}
*/
@rpsAction({verbName:'use-with'})
async useWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.useWith.apply(this,params);
}


/**************************** Ramda (Relation) ***********************************/

 /**
 * @function clamp
 * @memberof Basic
 * @example
 * clamp 1 10 15
 * 
 * @param {Number} number
 * @param {Number} number
 * @param {Number} number
 * 
 * @summary Ord a => a → a → a → a
 * 
 * @see {@link https://ramdajs.com/docs#clamp}
*/
@rpsAction({verbName:'clamp'})
async clamp (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.clamp.apply(this,params);
}

 /**
 * @function count-by
 * @memberof Basic
 * @example
 * count-by floor [1.0,1.1,1.2,2.3,2.5]
 * 
 * @param {Function} function
 * @param {Array} array
 * 
 * @summary (a → String) → [a] → {*}
 * 
 * @see {@link https://ramdajs.com/docs#countBy}
*/
@rpsAction({verbName:'count-by'})
async countBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.countBy.apply(this,params);
}

 /**
 * @function difference
 * @memberof Basic
 * @example
 * difference [1,2,3,4] [3,4,5,6]
 * 
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary [*] → [*] → [*]
 * 
 * @see {@link https://ramdajs.com/docs#difference}
*/
@rpsAction({verbName:'difference'})
async difference (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.difference.apply(this,params);
}

 /**
 * @function difference-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary ((a,a) → Boolean) → [a] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#differenceWith}
*/
@rpsAction({verbName:'difference-with'})
async differenceWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.differenceWith.apply(this,params);
}

 /**
 * @function eq-by
 * @memberof Basic
 * @example
 * eq-by (abs) 5 -5
 * 
 * @param {Function} function
 * @param {*} any
 * @param {*} any
 * 
 * @summary (a → b) → a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#eqBy}
*/
@rpsAction({verbName:'eq-by'})
async eqBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.eqBy.apply(this,params);
}

 /**
 * @function equals
 * @memberof Basic
 * @example
 * equals 5 5
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary a → b → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#equals}
*/
@rpsAction({verbName:'equals'})
async equals (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.equals.apply(this,params);
}

 /**
 * @function gt
 * @memberof Basic
 * @example
 * gt 2 1
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#gt}
*/
@rpsAction({verbName:'gt'})
async gt (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.gt.apply(this,params);
}

 /**
 * @function gte
 * @memberof Basic
 * @example
 * gte 2 2
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#gte}
*/
@rpsAction({verbName:'gte'})
async gte (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.gte.apply(this,params);
}

 /**
 * @function identical
 * @memberof Basic
 * @example
 * identical 1 1
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#identical}
*/
@rpsAction({verbName:'identical'})
async identical (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.identical.apply(this,params);
}

 /**
 * @function inner-join
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary ((a,b) → Boolean) → [a] → [b] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#innerJoin}
*/
@rpsAction({verbName:'inner-join'})
async innerJoin (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  //@ts-ignore
  return R.innerJoin.apply(this,params);
}

 /**
 * @function intersection
 * @memberof Basic
 * @example
 * intersection [1,2,3,4] [3,4,5,6]
 * 
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary [*] → [*] → [*]
 * 
 * @see {@link https://ramdajs.com/docs#intersection}
*/
@rpsAction({verbName:'intersection'})
async intersection (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.intersection.apply(this,params);
}

 /**
 * @function lt
 * @memberof Basic
 * @example
 * lt 2 1
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#lt}
*/
@rpsAction({verbName:'lt'})
async lt (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lt.apply(this,params);
}

 /**
 * @function lte
 * @memberof Basic
 * @example
 * lte 2 2
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#lte}
*/
@rpsAction({verbName:'lte'})
async lte (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.lte.apply(this,params);
}

 /**
 * @function max
 * @memberof Basic
 * @example
 * max 2 4
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → a
 * 
 * @see {@link https://ramdajs.com/docs#max}
*/
@rpsAction({verbName:'max'})
async max (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.max.apply(this,params);
}

 /**
 * @function max-by
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => (a → b) → a → a → a
 * 
 * @see {@link https://ramdajs.com/docs#maxBy}
*/
@rpsAction({verbName:'max-by'})
async maxBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.maxBy.apply(this,params);
}

 /**
 * @function min
 * @memberof Basic
 * @example
 * min 10 5
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => a → a → a
 * 
 * @see {@link https://ramdajs.com/docs#min}
*/
@rpsAction({verbName:'min'})
async min (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.min.apply(this,params);
}

 /**
 * @function minBy
 * @memberof Basic
 * @example
 * TODO
 * 
 * @param {Function} function
 * @param {*} any
 * @param {*} any
 * 
 * @summary Ord a => (a → b) → a → a → a
 * 
 * @see {@link https://ramdajs.com/docs#minBy}
*/
@rpsAction({verbName:'min-by'})
async minBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.minBy.apply(this,params);
}

 /**
 * @function path-eq
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary [Idx] → a → {a} → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#pathEq}
*/
@rpsAction({verbName:'path-eq'})
async pathEq (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pathEq.apply(this,params);
}

 /**
 * @function prop-eq
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary String → a → Object → Boolean
 * 
 * @see {@link https://ramdajs.com/docs#propEq}
*/
@rpsAction({verbName:'prop-eq'})
async propEq (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.propEq.apply(this,params);
}

 /**
 * @function sort-by
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary Ord b => (a → b) → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#sortBy}
*/
@rpsAction({verbName:'sort-by'})
async sortBy (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.sortBy.apply(this,params);
}

 /**
 * @function sort-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary [(a,a) → Number] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#sortWith}
*/
@rpsAction({verbName:'sort-with'})
async sortWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.sortWith.apply(this,params);
}

 /**
 * @function symmetric-difference
 * @memberof Basic
 * @example
 * symmetric-difference [1,2,3,4] [3,4,5,6,7]
 * 
 * @summary [*] → [*] → [*]
 * 
 * @see {@link https://ramdajs.com/docs#symmetricDifference}
*/
@rpsAction({verbName:'symmetric-difference'})
async symmetricDifference (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.symmetricDifference.apply(this,params);
}

 /**
 * @function symmetric-difference-with
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary ((a,a) → Boolean) → [a] → [a] → [a]
 * 
 * @see {@link https://ramdajs.com/docs#symmetricDifferenceWith}
*/
@rpsAction({verbName:'symmetric-difference-with'})
async symmetricDifferenceWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.symmetricDifferenceWith.apply(this,params);
}

 /**
 * @function union
 * @memberof Basic
 * @example
 * union [1,2,3] [2,3,4]
 * 
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary [*] → [*] → [*]
 * 
 * @see {@link https://ramdajs.com/docs#union}
*/
@rpsAction({verbName:'union'})
async union (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.union.apply(this,params);
}

 /**
 * @function union-with
 * @memberof Basic
 * @example
 * union-with (eq-by prop 'a') [{a:1}] [{a:1}]
 * 
 * @param {Array} array
 * @param {Array} array
 * 
 * @summary ((a,a) → Boolean) → [*] → [*] → [*]
 * 
 * @see {@link https://ramdajs.com/docs#unionWith}
*/
@rpsAction({verbName:'union-with'})
async unionWith (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.unionWith.apply(this,params);
}

/**************************** Ramda (Logic) ***********************************/


/**
 * @function all-pass
 * @memberof Basic
 * @example
 * TODO
 * 
 * @summary [(*...) → Boolean] → (*... → Boolean)
 * 
 * @see {@link https://ramdajs.com/docs#allPass}
*/
@rpsAction({verbName:'all-pass'})
async allPass (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.allPass.apply(this,params);
}

/**
 * @function and
 * @memberof Basic
 * @example
 * and true false
 * 
 * @param {*} any
 * @param {*} any
 * 
 * @summary a → b → a | b
 * 
 * @see {@link https://ramdajs.com/docs#and}
*/
@rpsAction({verbName:'and'})
async and (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.and.apply(this,params);
}

/**
 * @function any-pass
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#anyPass}
*/
@rpsAction({verbName:'any-pass'})
async anyPass (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.anyPass.apply(this,params);
}

/**
 * @function both
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#both}
*/
@rpsAction({verbName:'both'})
async both (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.both.apply(this,params);
}

/**
 * @function complement
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#complement}
*/
@rpsAction({verbName:'complement'})
async complement (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.complement.apply(this,params);
}

/**
 * @function cond
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#cond}
*/
@rpsAction({verbName:'cond'})
async cond (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.cond.apply(this,params);
}

/**
 * @function default-to
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#defaultTo}
*/
@rpsAction({verbName:'default-to'})
async defaultTo (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.defaultTo.apply(this,params);
}

/**
 * @function either
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#either}
*/
@rpsAction({verbName:'either'})
async either (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.either.apply(this,params);
}

/**
 * @function if-else
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#ifElse}
*/
@rpsAction({verbName:'if-else'})
async ifElse (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.ifElse.apply(this,params);
}

/**
 * @function is-empty
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#isEmpty}
*/
@rpsAction({verbName:'is-empty'})
async isEmpty (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.isEmpty.apply(this,params);
}

/**
 * @function not
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#not}
*/
@rpsAction({verbName:'not'})
async not (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.not.apply(this,params);
}

/**
 * @function or
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#or}
*/
@rpsAction({verbName:'or'})
async or (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.or.apply(this,params);
}

/**
 * @function path-satisfies
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#pathSatisfies}
*/
@rpsAction({verbName:'path-satisfies'})
async pathSatisfies (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.pathSatisfies.apply(this,params);
}

/**
 * @function prop-satisfies
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#propSatisfies}
*/
@rpsAction({verbName:'prop-satisfies'})
async propSatisfies (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.propSatisfies.apply(this,params);
}

/**
 * @function unless
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#unless}
*/
@rpsAction({verbName:'unless'})
async unless (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.unless.apply(this,params);
}

/**
 * @function until
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#until}
*/
@rpsAction({verbName:'until'})
async until (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.until.apply(this,params);
}

/**
 * @function when
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#when}
*/
@rpsAction({verbName:'when'})
async when (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.when.apply(this,params);
}

/**************************** Ramda (String) ***********************************/

 /**
 * @function trim
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#trim}
*/
@rpsAction({verbName:'trim'})
async trim (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.trim.apply(this,params);
}

 /**
 * @function match
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#match}
*/
@rpsAction({verbName:'match'})
async match (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.match.apply(this,params);
}

 /**
 * @function replace
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#replace}
*/
@rpsAction({verbName:'replace'})
async replace (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.replace.apply(this,params);
}

 /**
 * @function split
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#split}
*/
@rpsAction({verbName:'split'})
async split (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.split.apply(this,params);
}

 /**
 * @function test
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#test}
*/
@rpsAction({verbName:'test'})
async test (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.test.apply(this,params);
}

 /**
 * @function to-lower
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#toLower}
*/
@rpsAction({verbName:'to-lower'})
async toLower (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.toLower.apply(this,params);
}

 /**
 * @function to-string
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#toString}
*/
@rpsAction({verbName:'to-string'})
async toString (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.toString.apply(this,params);
}

 /**
 * @function to-upper
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#toUpper}
*/
@rpsAction({verbName:'to-upper'})
async toUpper (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.toUpper.apply(this,params);
}

/**************************** Ramda (Math) ***********************************/

 /**
 * @function add
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#add}
*/
@rpsAction({verbName:'add'})
async add (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.add.apply(this,params);
}

 /**
 * @function dec
 * @memberof Basic
 * 
 * @param {Array} params
 * 
 * @see {@link https://ramdajs.com/docs#dec}
*/
@rpsAction({verbName:'dec'})
async dec (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.dec.apply(this,params);
}

 /**
 * @function divide
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#divide}
*/
@rpsAction({verbName:'divide'})
async divide (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.divide.apply(this,params);
}

 /**
 * @function inc
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#inc}
*/
@rpsAction({verbName:'inc'})
async inc (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.inc.apply(this,params);
}

 /**
 * @function math-mod
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#mathMod}
*/
@rpsAction({verbName:'math-mod'})
async mathMod (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mathMod.apply(this,params);
}

 /**
 * @function mean
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#mean}
*/
@rpsAction({verbName:'mean'})
async mean (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.mean.apply(this,params);
}

 /**
 * @function median
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#median}
*/
@rpsAction({verbName:'median'})
async median (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.median.apply(this,params);
}

 /**
 * @function modulo
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#modulo}
*/
@rpsAction({verbName:'modulo'})
async modulo (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.modulo.apply(this,params);
}

 /**
 * @function multiply
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#multiply}
*/
@rpsAction({verbName:'multiply'})
async multiply (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.multiply.apply(this,params);
}

 /**
 * @function negate
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#negate}
*/
@rpsAction({verbName:'negate'})
async negate (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.negate.apply(this,params);
}

 /**
 * @function product
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#product}
*/
@rpsAction({verbName:'product'})
async product (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.product.apply(this,params);
}

 /**
 * @function subtract
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#subtract}
*/
@rpsAction({verbName:'subtract'})
async subtract (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.subtract.apply(this,params);
}

 /**
 * @function sum
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#sum}
*/
@rpsAction({verbName:'sum'})
async sum (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.sum.apply(this,params);
}

/**************************** Ramda (Type) ***********************************/

 /**
 * @function is
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#is}
*/
@rpsAction({verbName:'is'})
async is (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.is.apply(this,params);
}

 /**
 * @function is-nil
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#isNil}
*/
@rpsAction({verbName:'is-nil'})
async isNil (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.isNil.apply(this,params);
}

 /**
 * @function prop-is
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#propIs}
*/
@rpsAction({verbName:'prop-is'})
async propIs (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.propIs.apply(this,params);
}

 /**
 * @function type
 * @memberof Basic
 * @example
 * TODO
 * 
 * @see {@link https://ramdajs.com/docs#type}
*/
@rpsAction({verbName:'type'})
async type (ctx:RpsContext,opts:{}, ...params:any[]) : Promise<any> {
  return R.type.apply(this,params);
}

/**************************** Ramda (Customize) ***********************************/

 /**
 * @function r
 * @memberof Basic
 * @example
 * TODO
 * 
*/
@rpsAction({verbName:'r'})
async r (ctx:RpsContext,opts:{}, functionName:string) : Promise<any> {
  return R[functionName];
}

 /**
 * @function regexp
 * @memberof Basic
 * 
 * @param {RegExp} regexp regular expression
 * 
*/
@rpsAction({verbName:'regexp'})
async regexp (ctx:RpsContext,opts:{}, regexp:string) : Promise<RegExp> {
  return new RegExp(regexp);
}

}
