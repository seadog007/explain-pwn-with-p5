class Instruction{
  constructor(reg, page, io){
    this.reg = reg;
    this.page = page;
    this.io = io;
  }
  proxy(func, data){
    if (func && data){
      if (this[func]){
        if (data){
          this[func](data);
        }else{
          this[func]();
        }
      }else{
        throw 'No Implementation of ' + func;
      }
    }
  }
  nop(){
  }
  mov(data){
    if (data[0].includes(' ')){
    }else{
      // simple dst
      if (parseInt(data[1]) == data[1]){
        // const src
        this.mov_const(data)
      }
    }
  }
  mov_const(data){
    data[1] = little_endian_to_number(data[1]);
    this.reg.set(data[0], data[1]);
  }
  syscall(){
    new Syscall(this.reg, this.page, this.io);
  }
  push(data){
    this.reg.add('rsp', '-8');
    this.page.map(this.reg.get('rsp'), '\x00\x00\x00\x00\x00\x00\x00\x00'); // empty the memory space
    let value = little_endian_number_to_string(this.reg.get(data[0]).toString(16));
    this.page.map(this.reg.get('rsp'), value); // set value
  }
  pop(data){
    this.reg.set(data[0], little_endian_to_number(this.page.gets(this.reg.get('rsp'), 8)));
    this.reg.add('rsp', '8');
  }
}
