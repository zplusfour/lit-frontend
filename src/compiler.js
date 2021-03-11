const fs = require('fs');
const atob = (str) => {return Buffer.from(str).toString("binary")};

const e = require('express');
const LitWebServer = e(); // i know, this is silly, but this is a programming language so i'll call it whatever i want :)

class Compiler {
  /**
   * @param src {string}
   */
  constructor(src) {
    this.src = src;
  }

  tokens() {
    var _src = atob(fs.readFileSync(this.src));
    var tokens = _src.split("\n");

    var o = [];

    for (let token of tokens) {
      if (token.includes("\r")) {
        token = token.replace("\r", "");
        o.push(token);
      } else if (token.includes("\t")) {
        token = token.replace("\t", "");
        o.push(token);
      } else {
        o.push(token);
      }
    }

    return o;
  }

  compile() {
    var toks = this.tokens();

    for (let tok of toks) {
      if (tok.split(" ")[0] === "render" && tok.split(" ")[1] === "{" && toks[toks.length - 1]) {
        toks = toks.filter((t) => t !== "render {");
        toks = toks.filter((t) => t !== "}");
      } else if (tok.split(" ")[0] === "route" && tok.split(" ")[2] === "{" && toks[toks.length - 1]) {
        toks = toks.filter((t) => t !== `route ${/\w*(\W)/g} {`);
        toks = toks.filter((t) => t !== "}");
      } else {
        continue;
      }
    }

    return toks;
  }

  // getRoutes() {
  //   var toks = this.tokens();

  //   for (var t of toks) {
  //     if (t.split(" ")[0] === "route" && tok.split(" ")[2] === "{")
  //   }
  // }

  serve() {
    var c = this.compile();
    var o = [];

    for (let e of c) {
      o.push(e);
    }

    LitWebServer.listen(8080);
    return "Lit is listening on port 8080";
  }
}

module.exports = Compiler;