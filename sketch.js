let reg = new Register();
let page = new Page();

function setup() {
  createCanvas(800, 600);

  let program = page.new_segment('0x4004b0', '0x100', 'r-xp', 'program');
  let stack = page.new_segment('0x7fffffff0000', '0x1000', 'rw-p', 'stack0');

  reg.set('rbp', '0x7fffffff0200');
  reg.set('rsp', '0x7fffffff0200');
  reg.set('rip', '0x4004b2');

}

function draw() {
  clear();
  background(255);
  reg_box(600, 270, reg, 0, 16);
  hex_dump(50, 200, page, reg.get('rsp'), '0x80');
  hex_dump(100, 400, page, '0x4004b0', '0x60');
  vmmap_box(550, 200, page);
}
