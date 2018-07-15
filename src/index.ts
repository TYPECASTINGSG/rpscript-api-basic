/**
 * @module Basic
 */

import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';
import { EventEmitter } from 'events';


@RpsModule("basic")
export default class RPSBasic {

  @rpsAction({verbName:'console-log'})
  async print(ctx:RpsContext,opts:{}, data:any) : Promise<any>{
    console.log(data);
    return data;
  }

  @rpsAction({verbName:'as'})
  as (ctx:RpsContext,opts:{}, variable:string, value:any) : Promise<any>{
    variable = variable.trim();
    ctx.variables[variable] = value;

    if(variable.charAt(0)!=='$') variable = '$'+variable;

    ctx.variables[variable] = value;

    return Promise.resolve(value);
  }

  //just a duplication of 'as'
  @rpsAction({verbName:'assign'})
  assign (ctx:RpsContext,opts:{}, variable:string, value:any) : Promise<any>{
    variable = variable.trim();
    ctx.variables[variable] = value;

    if(variable.charAt(0)!=='$') variable = '$'+variable;

    ctx.variables[variable] = value;

    return Promise.resolve(value);
  }

  @rpsAction({verbName:'if'})
  if (ctx:RpsContext,opts:{}, condition:boolean, exec:Function) : Promise<any>{
    if(condition) return Promise.resolve(exec());
    else return Promise.resolve(null);
  }

  @rpsAction({verbName:'once'})
  once (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string) : Promise<any>{
    return new Promise(function(resolve) {
      event.once(evtName, (...params) => resolve(params));
    });
  }
  @rpsAction({verbName:'on'})
  async on (ctx:RpsContext,opts:{}, event:EventEmitter, evtName:string, cb:(any)=>void) : Promise<EventEmitter>{
    event.on(evtName, (...params) => cb(params));
    return event;
  }

  @rpsAction({verbName:'data-type'})
  async dataType (ctx:RpsContext,opts:{}, item:any) : Promise<string>{
    let type;
    if(item instanceof Array) type = 'array';
    else if(item instanceof Object) type = 'object';
    else type = typeof item;
    
    return type;
  }

  @rpsAction({verbName:'wait'})
  wait (ctx:RpsContext,opts:{}, period:number) : Promise<any>{
    return new Promise(function(resolve) {
      setTimeout(function () {
        resolve(ctx.$RESULT);
      }, period*1000);
    });
  }

  @rpsAction({verbName:'get-element'})
  async getElement (ctx:RpsContext,opts:{},items:any, ...position :any[]) : Promise<any>{
    
    let v = items;
    for(var i=0;i<position.length;i++){
      v = v[ position[i] ];
      if(v===undefined)return undefined;
    }
    return v;
  }



}
