
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
    let rip = this.reg.get('rip');

    for (let i = BigInt(0); i < 16; i++) {
      ins_set.push(parseInt(this.page.get(rip + i).toString()));
    }

    let ins = this.p.parse(ins_set, rip.toString())[0];
    //console.log(ins);
    console.log(ins.mnemonic + ' ' + ins.op_str);
    this.runner.proxy(ins.mnemonic, ins.op_str.split(',').map(arg => {return arg.trim();}));
    reg.set('rip', rip + BigInt(ins.size));
  }
}

function ins_box(start_x, start_y, executor){
  let ins_set = [];
  let rip = executor.reg.get('rip');
  let empty_row = 0;

  let first_addr = null;
  for (let i = BigInt(-16); i < 16; i++) {
    let addr = rip + i;
    if (executor.page.what_collide(addr)){
      if (!first_addr){
        first_addr = addr;
      }
      ins_set.push(parseInt(executor.page.get(rip + i).toString()));
    }
  }

  let inss = executor.p.parse(ins_set, first_addr.toString());

  let middle_index = 0;
  for (i in inss){
    if (inss[i].address == rip.toString()){
      middle_index = i;
      break;
    }
  }

  let dumptext = '';
  for (let i=-4; i<=4; i++){
    let index = middle_index - -i; // for prevent string addition, fuck you JS :D
    let line = '';
    if (index > (inss.length - 1) || index < 0){
    }else{
      if (i == 0){
        line += '-> ';
      }else{
        line += '   ';
      }
      line += BigInt(inss[index].address).toString(16) + ':';
      line = pad(line, '-> '.length + 13, ' ');
      line += '  ' + inss[index].mnemonic + ' ' + inss[index].op_str;
    }
    dumptext += line + '\n';
  }

  textAlign(LEFT, TOP);
  dumptext = 'Running Instruction:\n' + dumptext;
  text(dumptext, start_x, start_y, start_x + 500, start_y + 200);
}
