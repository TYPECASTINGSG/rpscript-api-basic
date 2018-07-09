import {expect} from 'chai';
import m from 'mocha';

import RPSBasic from '../src/index';
import { RpsContext } from 'rpscript-interface';

m.describe('Basic', () => {

  m.it('should pop up hello world notification', async function () {
    let context = new RpsContext;
    let basic = new RPSBasic;

    await basic.as(context,{},"period",5);

    expect(context.variables['period']).to.be.equals(5);

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

})
