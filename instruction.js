class Instruction{
  constructor(reg, page, io){
    this.reg = reg;
    this.page = page;
    this.io = io;
  }
  nop(log, reg, data){
    console.log(log);
  }
  mov_const(log, reg, data){
    data = little_endian_to_number(data);
    this.reg.set(reg, data);
    console.log(log.replace('%reg', reg).replace('%value', byte_to_hex(data)));
  }
  syscall(log, reg, data){
    new Syscall(this.reg, this.page, this.io);
    console.log(log);
  }
  push64(log, reg, data){
    this.reg.add('rsp', '-8');
    this.page.map(this.reg.get('rsp'), '\x00\x00\x00\x00\x00\x00\x00\x00'); // empty the memory space
    let value = little_endian_number_to_string(this.reg.get(reg).toString(16));
    this.page.map(this.reg.get('rsp'), value); // set value
    console.log(log.replace('%reg', reg));
  }
  pop64(log, reg, data){
    this.reg.set(reg, little_endian_to_number(this.page.gets(this.reg.get('rsp'), 8)));
    this.reg.add('rsp', '8');
    console.log(log.replace('%reg', reg));
  }
}
