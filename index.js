const c = require('./src/compiler');
const compiler = new c("tests/test.lfx");

console.log(compiler.serve());