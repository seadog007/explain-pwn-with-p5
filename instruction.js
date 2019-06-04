class Instruction{
  constructor(reg, page, io){
    this.reg = reg;
    this.page = page;
    this.io = io;
  }
  nop(log, reg, data){
    console.log(log);
  }
  mov(log, reg, data){
    data = little_endian_to_number(data);
    this.reg.set(reg, data);
    console.log(log.replace('%reg', reg).replace('%value', byte_to_hex(data)));
  }
  syscall(log, reg, data){
    new Syscall(this.reg, this.page, this.io);
    console.log(log);
  }
}
