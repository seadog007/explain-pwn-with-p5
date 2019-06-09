class Page {
  constructor() {
    this.page = [];
  }
  collision_check(start, end) {
    let stat = false;
    for (let i of this.page) {
      stat |= overlap(start, end, i.start, i.end).toString() != 0;
    }
    return stat
  }
  what_collide(addr) {
    addr = BigInt(addr);
    for (let i of this.page) {
      if (overlap(addr, addr + BigInt(1), i.start, i.end).toString() != 0) {
        return i;
      }
    }
    return null;
  }
  new_segment(base, length, attr, name) {
    base = BigInt(base);
    length = BigInt(length);
    let end = base + length;
    if (this.collision_check(base, end)) {
      console.log('coll');
      return false;
    }
    let mem = new Memory(length);
    this.page.push({
      'start': base,
      'end': end,
      'length': length,
      'attr': attr,
      'name': name,
      'content': mem
    })
    return mem;
  }
  vmmap() {
    let output = [];
    for (let i of this.page) {
      output.push({
        'start': i.start.toString(16),
        'end': i.end.toString(16),
        'length': i.length.toString(16),
        'attr': i.attr,
        'name': i.name
      });
    }
    return output;
  }
  get(addr) {
    addr = BigInt(addr);
    if (page.collision_check(addr, addr + BigInt(1))) {
      let mem_seg = page.what_collide(addr);
      if (mem_seg) {
        let offset = addr - mem_seg.start;
        return mem_seg.content.get(offset.toString());
      }
    } else {
      throw 'Access Violation';
    }
  }
  gets(addr, length) {
    addr = BigInt(addr);
    let output = [];
    for(let i = BigInt(0); i < length; i++){
      output.push(this.get(addr + BigInt(i)));
    }
    return output;
  }
  set(addr, value) {
    addr = BigInt(addr);
    if (typeof value == 'string'){
      value = value.charCodeAt(0)
    }
    if (page.collision_check(addr, addr + BigInt(1))) {
      let mem_seg = page.what_collide(addr);
      if (mem_seg) {
        let offset = addr - mem_seg.start;
        mem_seg.content.set(offset.toString(), value);
      }
    } else {
      throw 'Access Violation';
    }
  }
  map(addr, value){
    addr = BigInt(addr);
    for(let i in value){
      this.set(addr + BigInt(i), value[i]);
    }
  }
}

function vmmap_box(start_x, start_y, page) {
  textAlign(LEFT, TOP);
  let dumptext =  pad('start', 14,' ') + '\t' + pad('end', 14, ' ') + '\t len\tattr\tname\n';
  for (i of page.vmmap()) {
    dumptext += '0x' + pad(i.start, 12, '0') + '\t0x' + pad(i.end, 12, '0') + '\t' + pad(i.length, 4, ' ') + '\t' + i.attr + '\t' + i.name + '\n';
  }
  text(dumptext, start_x, start_y, start_x + 500, start_y + 200);
}

function hex_dump(start_x, start_y, page, start, length, comment) {
  start = BigInt(start);
  length = BigInt(length);
  let dumptext = '';
  if (length > 0) {
    for (let i = BigInt(0); i < length; i++) {
      if (i % BigInt(0x10) == 0) {
        if (i != 0) {
          dumptext += '\n';
        }
        dumptext += '0x' + pad((start + i).toString(16), 12) + ': ';
      }
      dumptext += pad(page.get(start + i).toString(16), 2) + ' ';
    }
  }
  textAlign(LEFT, TOP);
  comment += ':\n';
  dumptext = comment + dumptext;
  text(dumptext, start_x, start_y, start_x + 500, start_y + 200);
}
