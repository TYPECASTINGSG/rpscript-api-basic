import {expect} from 'chai';
import m from 'mocha';

import RPSBasic from '../src/index';
import { RpsContext } from 'rpscript-interface';

m.describe('Basic', () => {

  m.it('should pop up hello world notification', async function () {
    let context = new RpsContext;
    let basic = new RPSBasic;

    await basic.as(context,{},"period",5);

    await basic.wait(context,{},2);

    expect(context.variables['period']).to.be.equals(5);
  }).timeout(0);

})
