let list64 = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi'];
let list32 = ['eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi'];
let list16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'];
let list8 = ['al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil'];



let done = {
  0x50: 'push rax',
  0x51: 'push rcx',
  0x52: 'push rdx',
  0x53: 'push rbx',
  0x54: 'push rsp',
  0x55: 'push rbp',
  0x56: 'push rsi',
  0x57: 'push rdi',
  0x58: 'pop rax',
  0x59: 'pop rcx',
  0x5a: 'pop rdx',
  0x5b: 'pop rbx',
  0x5c: 'pop rsp',
  0x5d: 'pop rbp',
  0x5e: 'pop rsi',
  0x5f: 'pop rdi',
  0x90: 'nop',
  0xc3: 'ret',
  0x0f05: 'syscall'
};

class Parser {
  constructor(bytes) {
    this.set = bytes;
  }
  do_it(reg, page, io) {
    let sbyte = this.set[0];
    if (sbyte == 0x48) {
      // 64bit mode

      return 1;
    }
    if (sbyte == 0xc7) {
      // 32 bit
    }
    if (sbyte >= 0x50 && sbyte <= 0x5f) {
      if (set[0] >= 0x58) {
        this.pop_single_main64(reg, page, io, this.set);
      } else {
        this.push_single_main64(reg, page, io, this.set);
      }
      return 1;
    }
    if (sbyte >= 0xb0 && sbyte <= 0xb7) {
      this.mov_single_main8(reg, page, io, this.set)
      return 2;
    }
    if (sbyte >= 0xb8 && sbyte <= 0xbf) {
      this.mov_single_main64(reg, page, io, this.set)
      return 5;
    }
    if (sbyte == 0x66) {
      if (this.set[1] >= 0xb8 && this.set[1] <= 0xbf) {
        this.mov_single_main16(reg, page, io, this.set)
        return 4;
      }
    }
    if (sbyte == 0x90) {
      return 1;
    }
    if (sbyte == 0xc3) {
      return 1;
    }
    if (sbyte == 0x0f) {
      // double bytes instruction
      if (this.set[1] == 0x05) {
        new Syscall(reg, page, io);
        return 2;
      }
    }
    throw 'a';
    return 0;
  }

  pop_single_main64(reg, page, io, set) {
    let reg_name = list64[(set[0] - 0x50) % 8];

    // pop rxx
    let data = page.gets(reg.get('rsp'), 8);
    console.log(data);
    let sum = BigInt(0);
    for (let i in data) {
      sum += BigInt(data[i]) * (BigInt(256) ** BigInt(i));
    }
    reg.set(reg_name, sum)
    reg.add('rsp', '8');
    console.log('pop ' + reg_name);
  }

  push_single_main64(reg, page, io, set) {
    let reg_name = list64[(set[0] - 0x50) % 8];
    // push rxx
    reg.add('rsp', '-8');
    console.log(reg.get('rsp').toString(16));
    page.map(reg.get('rsp'), '\x00\x00\x00\x00\x00\x00\x00\x00');
    let value = reverseString(hex_to_ascii(reg.get(reg_name).toString(16)));
    page.map(reg.get('rsp'), value)
    console.log('push ' + reg_name);
  }

  mov_single_main8(reg, page, io, set) {
    let reg_name = list8[(set[0] - 0xb8) % 8];
    let sum = BigInt(set[1]);
    reg.set(reg_name, sum);
    console.log('mov ' + reg_name + ', ' + sum.toString(16));
  }
  mov_single_main16(reg, page, io, set) {
    let reg_name = list16[(set[1] - 0xb8) % 8];
    let sum = BigInt(0);
    for (let i = 2; i < 4; i++) {
      sum += BigInt(set[i]) * (BigInt(256) ** BigInt(i - 2));
    }
    reg.set(reg_name, sum);
    console.log('mov ' + reg_name + ', ' + sum.toString(16));
  }
  mov_single_main32(reg, page, io, set) {
    let reg_name = list32[(set[1] - 0xb8) % 8];
    let sum = BigInt(0);
    for (let i = 2; i < 4; i++) {
      sum += BigInt(set[i]) * (BigInt(256) ** BigInt(i - 2));
    }
    reg.set(reg_name, sum);
    console.log('mov ' + reg_name + ', ' + sum.toString(16));
  }
  mov_single_main64(reg, page, io, set) {
    let reg_name = list64[(set[0] - 0xb8) % 8];
    let sum = BigInt(0);
    for (let i = 1; i < 4; i++) {
      sum += BigInt(set[i]) * (BigInt(256) ** BigInt(i - 1));
    }
    reg.set(reg_name, sum);
    console.log('mov ' + reg_name + ', ' + sum.toString(16));
  }
}
