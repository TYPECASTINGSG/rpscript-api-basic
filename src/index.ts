/**
 * @module Basic
 */

import notifier from 'node-notifier';
import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';
import { EventEmitter } from 'events';


@RpsModule("basic")
export default class RPSBasic {

  @rpsAction({verbName:'as'})
  as (ctx:RpsContext,opts:{}, variable:string, value:any) : Promise<any>{
    
    ctx.variables[variable] = value;

    if(variable.charAt(0)!=='$') variable = '$'+variable;
    else variable = variable.replace('$','');

    ctx.variables[variable] = value;

    return Promise.resolve(value);
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



}
