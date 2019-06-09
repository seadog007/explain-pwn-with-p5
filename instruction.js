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
    if (data[0].includes('ptr')){
      // ptr dst
      if (parseInt(data[1]) == data[1]){
        // const src
        this.mov_const_to_ptr(data)
      }else if (is_general_register(data[1])){
        // reg src
        this.mov_reg_to_ptr(data);
      }else{
        // ptr src
        this.mov_ptr_to_ptr(data);
      }
    }else{
      // simple dst
      if (parseInt(data[1]) == data[1]){
        // const src
        this.mov_const_to_reg(data);
      }else if (is_general_register(data[1])){
        // reg src
        this.mov_reg_to_reg(data);
      }else{
        // ptr src
        this.mov_ptr_to_reg(data);
      }
    }
  }
  mov_const_to_reg(data){
    data[1] = little_endian_to_number(data[1]);
    this.reg.set(data[0], data[1]);
  }
  mov_reg_to_reg(data){
    let len = is_general_register(data[0]);
    data[1] = this.reg.get(data[1], len);
    this.reg.set(data[0], data[1]);
  }
  mov_ptr_to_reg(data){
    let addr = parse_ptr(this.reg, data[1]);
    let size = parse_mov_size(data[1]);
    let len = is_general_register(data[0]);
    if (size != len){
      throw 'Size not match in mov instruction';
    }
    data[1] = little_endian_to_number(this.page.gets(addr, len));
    reg.set(data[0], data[1]);
  }
  mov_const_to_ptr(data){
    throw 'Not finish';
  }
  mov_reg_to_ptr(data){
    let addr = parse_ptr(this.reg, data[0]);
    let size = parse_mov_size(data[0]);
    this.page.map(addr, little_endian_number_to_string(reg.get(data[1]).toString(16)));
  }
  mov_ptr_to_ptr(data){
    throw 'Not finish';
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
