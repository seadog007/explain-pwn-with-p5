let based_keys = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp', 'rip', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];
let defined_keys = [
  {'filter': BigInt('0x' + 'f'.repeat(16)), 'name_list': ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp', 'rip', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']},
  {'filter': BigInt('0x' + 'f'.repeat(8)), 'name_list': ['eax', 'ebx', 'ecx', 'edx', 'esi', 'edi', 'ebp', 'esp', 'eip', 'r8d', 'r9d', 'r10d', 'r11d', 'r12d', 'r13d', 'r14d', 'r15d']},
  {'filter': BigInt('0x' + 'f'.repeat(4)), 'name_list': ['ax', 'bx', 'cx', 'dx', 'si', 'di', 'bp', 'sp', 'ip', 'r8w', 'r9w', 'r10w', 'r11w', 'r12w', 'r13w', 'r14w', 'r15w']},
  {'filter': BigInt('0x' + 'f'.repeat(2)), 'name_list': ['al', 'bl', 'cl', 'dl', 'sil', 'dil', 'bpl', 'spl', '8ip', 'r8b', 'r9b', 'r10b', 'r11b', 'r12b', 'r13b', 'r14b', 'r15b']}
];
class Register {
  constructor() {
    this.rax = BigInt(0);
    this.rbx = BigInt(0);
    this.rcx = BigInt(0);
    this.rdx = BigInt(0);
    this.rsi = BigInt(0);
    this.rdi = BigInt(0);
    this.rbp = BigInt(0);
    this.rsp = BigInt(0);
    this.rip = BigInt(0);
    this.r8 = BigInt(0);
    this.r9 = BigInt(0);
    this.r10 = BigInt(0);
    this.r11 = BigInt(0);
    this.r12 = BigInt(0);
    this.r13 = BigInt(0);
    this.r14 = BigInt(0);
    this.r15 = BigInt(0);
    this.STOP = 0;
    this.RET = 0;
  }
  count() {
    return 17;
  }
  get_values(type) {
    let output = [];
    let keys = Object.keys(this);

    for (let i of keys) {
      if (based_keys.includes(i)) {
        output.push({
          'name': defined_keys[type]['name_list'][based_keys.indexOf(i)],
          'value': this[i] & defined_keys[type]['filter']
        });
      }
    }
    return output;
  }
  set(name, value) {
    for (let i of defined_keys) {
      if (i.name_list.includes(name)) {
        let index = i.name_list.indexOf(name);
        name = based_keys[index];
        value = BigInt(value) & i.filter;
        this[name] = value & i.filter;
        return true;
      }
    }
    return false;
  }
  get(name) {
    for (let i of defined_keys) {
      if (i.name_list.includes(name)) {
        let index = i.name_list.indexOf(name);
        name = based_keys[index];
        return this[name] & i.filter;
      }
    }
    return false;
  }
  add(name, value) {
    let keys = Object.keys(this);
    if (keys.includes(name)) {
      value = BigInt(value);
      this[name] = this[name] + value;
      return this[name] + value;
    }
    return false;
  }
}

function reg_box(start_x, start_y, reg, type, base) {
  box_w = 90;
  box_diff = 45;
  box_h = 17;
  total_w = box_w * 2;
  total_h = box_h * (reg.count() + 1);
  split_x = start_x + box_w - box_diff
  rect(start_x, start_y, total_w, total_h);
  line(split_x, start_y, split_x, start_y + total_h);

  textAlign(CENTER, CENTER);

  text('Name', start_x, start_y, box_w - box_diff, box_h);
  text('Value', split_x, start_y, box_w + box_diff, box_h);
  line(start_x, start_y + box_h, start_x + total_w, start_y + box_h)

  let base_prefix = {
    '16': '0x',
    '10': ''
  };
  let base_pad = {
    '0': 12,
    '1': 8,
    '2': 4,
    '3': 2
  };
  reg_set = reg.get_values(type);
  let count = 0;
  for (let i of reg_set) {
    count++;
    text(i.name, start_x, start_y + box_h * count, box_w - box_diff, box_h);
    text(base_prefix[base] + pad(i.value.toString(base), base_pad[type]), split_x, start_y + box_h * count, box_w + box_diff, box_h);
    line(start_x, start_y + box_h + box_h * count, start_x + total_w, start_y + box_h + box_h * count)
  }
}
