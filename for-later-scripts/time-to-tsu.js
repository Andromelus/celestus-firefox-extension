let monthList = ['Onovahn', 'Celetahn', 'Feloahn', 'Koylahn', 'Jileahn', 'Dolahn', 'Stelahn', 'Pookahn', 'Volahn', 'Erehahn'];
let timestamp = Date.now()/1000;
let year = Math.floor(timestamp / 86400);
timestamp = timestamp - year * 86400;

let month = Math.floor(timestamp / 8640);
timestamp = timestamp - month * 8640;

let day = Math.floor(timestamp / 216);
month += 1;
day += 1;