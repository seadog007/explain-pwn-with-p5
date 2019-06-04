let list64 = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi'];
let list32 = ['eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi'];
let list16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'];
let list8 = ['al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil'];

let op_code = [
  {'op': [0x50],              'extend_set': list64,   'extend_loc': 0,    'log': 'push %reg',         'comment': 'push r64',            'handler': 'push_single_main64',  'data_bytes': 0},
  {'op': [0x58],              'extend_set': list64,   'extend_loc': 0,    'log': 'pop %reg',          'comment': 'pop r64',             'handler': 'pop_single_main64',   'data_bytes': 0},
  {'op': [0xb0],              'extend_set': list8,    'extend_loc': 0,    'log': 'mov %reg, %value',  'comment': 'mov r8, const8',      'handler': 'mov_single_main8',    'data_bytes': 1},
  {'op': [0x66, 0xb8],        'extend_set': list16,   'extend_loc': 1,    'log': 'mov %reg, %value',  'comment': 'mov r16, const16',    'handler': 'mov_single_main16',   'data_bytes': 2},
  {'op': [0x66, 0xc7, 0xc0],  'extend_set': list16,   'extend_loc': 2,    'log': 'mov %reg, %value',  'comment': 'mov r16, const16',    'handler': 'mov_single_main16',   'data_bytes': 2},
  {'op': [0xb8],              'extend_set': list32,   'extend_loc': 0,    'log': 'mov %reg, %value',  'comment': 'mov r32, const32',    'handler': 'mov_single_main32',   'data_bytes': 4},
  {'op': [0xc7, 0xc0],        'extend_set': list32,   'extend_loc': 1,    'log': 'mov %reg, %value',  'comment': 'mov r32, const32',    'handler': 'mov_single_main32',   'data_bytes': 4},
  {'op': [0x48, 0xc7, 0xc0],  'extend_set': list64,   'extend_loc': 2,    'log': 'mov %reg, %value',  'comment': 'mov r64, const32',    'handler': 'mov_single_main64',   'data_bytes': 4},
  {'op': [0x48, 0xb8],        'extend_set': list64,   'extend_loc': 1,    'log': 'mov %reg, %value',  'comment': 'movabs r64, const64', 'handler': 'mov_single_main64',   'data_bytes': 8},
  {'op': [0x90],              'extend_set': null,     'extend_loc': null, 'log': 'nop',               'comment': 'nop',                 'handler': 'nop',                 'data_bytes': 0},
  {'op': [0x0f, 0x05],        'extend_set': null,     'extend_loc': null, 'log': 'syscall',           'comment': 'syscall',             'handler': 'syscall',             'data_bytes': 0},
].map(op => { // extend op code list from one to manys
  let new_op_codes = [];
    // only extend when `extend_set` not null
    if (op.extend_set != null) {
      for (let i in op.extend_set) {
        // clone object, can replace by lodash
        let new_op = Object.assign({}, op);               // clone
        new_op.op = Object.assign([], op.op);             // array need clone again

        new_op.op[new_op.extend_loc] -= 0 - i;            // prevent to use operator `+=` for misappend as string
        new_op.reg = op.extend_set[i];
        new_op_codes.push(new_op);                        // append extended op_list
      }
    } else {
      new_op_codes = [ op ];
    }
    return new_op_codes;
}).flat();    // flatten them

// handler_exmaple(reg, page, io, log_format, match_reg, data);
// [0x90] => nop(reg, page, io, 'nop', null, null);]
// [0x48, 0xb9, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00] => mov_single_main64(reg, page, io, 'mov %reg, %value', 'rcx', [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
// [0x48, 0xc7, 0xc0, 0x00, 0x00, 0x00, 0x00] => mov_single_main64(reg, page, io, 'mov %reg, %value', 'rax', [0x00, 0x00, 0x00, 0x00]);

class Parser {
  constructor(bytes) {
    this.set = bytes;
  }
  do_it(reg, page, io) {
    throw 'a';
    return 0;
  }
}
