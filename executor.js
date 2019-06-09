
class Executor {
  constructor(reg, page, io) {
    this.reg = reg;
    this.page = page;
    this.io = io;
    this.p = new Parser();
    this.runner = new Instruction(reg, page, io);
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

    let ins = this.p.parse(ins_set, rip);
    //console.log(ins);
    console.log(ins.mnemonic + ' ' + ins.op_str);
    this.runner.proxy(ins.mnemonic, ins.op_str.split(',').map(arg => {return arg.trim();}));
    reg.set('rip', this.reg.get('rip') + BigInt(ins.size));
  }
}
