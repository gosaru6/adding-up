'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); //key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
      let value = map.get(prefecture);
      // 1週目は空の配列なので↓のif文の処理を行う
      if (!value) {
        value = {
          popu10: 0,  //p10 -> 2010年の人口
          popu15: 0,  //p15 -> 2010年の人口
          change: null //change -> 変化率 
        };
      }
      if (year === 2010) {
        value.popu10 += popu; // 受け取った人口の数を配列の値にセット 
      } 
      if (year === 2015) {
        value.popu15 += popu;
      }
      map.set(prefecture, value);
  }
});
rl.resume();
rl.on('close', () => {
  for (let pair of map) {
    const value = pair[1];
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map((pair) => {
    return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
  });
  console.log(rankingStrings);
});