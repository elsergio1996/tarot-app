import test from 'node:test';
import assert from 'node:assert/strict';
import { drawCards, sessionPrice } from '../src/tarotLogic.mjs';

test('drawCards devuelve cantidad pedida sin repetir',()=>{
  const deck=['A','B','C','D','E'];
  let values=[0,.5,.9]; let i=0;
  const out=drawCards(deck,3,()=>values[i++]);
  assert.equal(out.length,3);
  assert.equal(new Set(out).size,3);
});

test('drawCards rechaza mazo insuficiente',()=>assert.throws(()=>drawCards(['A'],3)));
test('precio de sesión normal',()=>assert.equal(sessionPrice(10000,30,false),10000));
test('precio de sesión en vivo aplica 25%',()=>assert.equal(sessionPrice(10000,30,true),12500));
