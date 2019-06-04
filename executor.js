class Executor {
  constructor(reg, page, io) {
    this.reg = reg;
    this.page = page;
    this.io = io;
  }
  next() {
    if (this.reg.STOP){
      return this.reg.RET;
    }
    console.log('running 0x' + this.reg.get('rip').toString(16));
    let ins_set = [];
    let rip = this.reg.get('rip').toString();

    for (let i = BigInt(0); i < 16; i++) {
      ins_set.push(parseInt(this.page.get(this.reg.get('rip') + i).toString()))
    }

    let parser = new Parser(ins_set);
    let used = parser.do_it(reg, page, io);
    reg.set('rip', this.reg.get('rip') + BigInt(used))
  }
}
