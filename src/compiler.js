const fs = require('fs');
const atob = (str) => {return Buffer.from(str).toString("binary")};

const http = require('http');

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
      } else {
        continue;
      }
    }

    return toks;
  }

  serve() {
    var c = this.compile();
    var o = [];

    for (let e of c) {
      o.push(e);
    }

    http.createServer(function (req, res) {
      // res.write(String(o.toString()).replace(",", ""));
      for (var t of o) {
        res.write(t);
      }
      res.end();
    }).listen(8080);

    return "Lit is listening on port 8080";
  }
}

module.exports = Compiler;