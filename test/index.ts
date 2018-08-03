import {expect} from 'chai';
import m from 'mocha';

import RPSBasic from '../src/index';
import { RpsContext } from 'rpscript-interface';

m.describe('Basic', () => {

  m.it.only('should pop up hello world notification', async function () {
    let context = new RpsContext;
    let basic = new RPSBasic;

    await basic.as(context,{},"period",5);

    // expect(context.variables['period']).to.be.equals(5);
    expect(context.variables['$period']).to.be.equals(5);

    await basic.as(context,{},"$val",'hello');

    // expect(context.variables['val']).to.be.equals('hello');
    expect(context.variables['$val']).to.be.equals('hello');

    console.log('hello');
    let fn = await basic.wait(context,{},1);
    let output = fn('world');
    console.log(output);

    console.log(await basic.wait(context,{},1,'welcome'));
    console.log(await basic.wait(context,{},2,undefined));

  }).timeout(0);


  m.it('should print and return Hello', async function () {
    let basic = new RPSBasic;
    let context = new RpsContext;

    let output = await basic.print(context,{},'Hello');
    expect(output).to.be.equals('Hello');
  });

  // m.it('should do calculation', async function () {
  //   let basic = new RPSBasic;
  //   let context = new RpsContext;

  //   let output = await basic.evaluate(context,{},'a + b',5,4);
  //   expect(output).to.be.equal(9);

  //   output = await basic.evaluate(context,{function:true},'a + b',5);
  //   expect(output(4)).to.be.equal(9);

  //   output = await basic.evaluate(context,{},'a + 4');
  //   expect(output(10)).to.be.equal(14);

  //   output = await basic.evaluate(context,{},'9 + 4');
  //   expect(output(1)).to.be.equal(13);

  //   output = await basic.evaluate(context,{function:false},'9 + 4');
  //   expect(output).to.be.equal(13);
  // });
  
  m.it('should perform maths operation', async function () {
    let basic = new RPSBasic;
    let context = new RpsContext;

    let output = await basic.abs(context,{function:false},-1.23);
    expect(output).to.be.equal(1.23);
  });

  m.it('should call power with varying argument number', async function () {
    let basic = new RPSBasic;
    let context = new RpsContext;

    let output:any = await basic.power(context,{},2,3);
    expect(output).to.be.equal(8);

    output = await basic.power(context,{},2);
    expect(output(3)).to.be.equal(8);

    output = await basic.power(context,{});
    expect(output(2,3)).to.be.equal(8);

    output = await basic.min(context,{});
    expect(output(5,6)).to.be.equal(5);

    output = await basic.min(context,{},9);
    expect(output(3)).to.be.equal(3);

    output = await basic.min(context,{},7,1);
    expect(output).to.be.equal(1);
  });


})
