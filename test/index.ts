import {expect} from 'chai';
import m from 'mocha';

import RPSBasic from '../src/index';
import { RpsContext } from 'rpscript-interface';

m.describe('Basic', () => {

  m.it('should pop up hello world notification', async function () {
    let context = new RpsContext;
    let basic = new RPSBasic;

    await basic.as(context,{},"period",5);

    // expect(context.variables['period']).to.be.equals(5);
    expect(context.variables['$period']).to.be.equals(5);

    await basic.as(context,{},"$val",'hello');

    // expect(context.variables['val']).to.be.equals('hello');
    expect(context.variables['$val']).to.be.equals('hello');

    await basic.wait(context,{},2);

    let type = await basic.dataType(context,{},2);
    expect(type).to.be.equals('number');

    type = await basic.dataType(context,{},[1,2,3]);
    expect(type).to.be.equals('array');

    type = await basic.dataType(context,{},['1','2','3']);
    expect(type).to.be.equals('array');

    type = await basic.dataType(context,{},{a:1,b:2,c:3});
    expect(type).to.be.equals('object');

  }).timeout(0);

  m.it('should get the element from list', async function () {
    let basic = new RPSBasic;
    let context = new RpsContext;
    
    let v = await basic.getElement(context,{},[1,2,3],1);
    expect(v).to.be.equals(2);

    v = await basic.getElement(context,{},[[1,2],[3,4],[5,6]],1,1);
    expect(v).to.be.equals(4);

    v = await basic.getElement(context,{},[[1,2],[3,4],[5,6]],1);
    expect(v).to.be.deep.equals([3,4]);

    v = await basic.getElement(context,{},{a:1,b:2,c:3},'c');
    expect(v).to.be.deep.equals(3);

    v = await basic.getElement(context,{},{a:1,b:2,c:{d:5}},'c','d');
    expect(v).to.be.deep.equals(5);

    v = await basic.getElement(context,{},{a:1,b:2,c:{d:5}},'c','f');
    expect(v).to.be.undefined;

  });

})
