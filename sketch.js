let reg = new Register();
let page = new Page();
let stdin = new FD('stdin', {'read': prompt.bind(window)});
let stdout = new FD('stdout', {'write': console.log});
let stderr = new FD('stderr', {'write': alert.bind(window)});
let io = new IO([stdin, stdout, stderr]);
var executor = new Executor(reg, page, io);

function preload() {
  fontRegular = loadFont('Menlo-Regular.ttf');
}

function setup() {
  createCanvas(800, 600);
  textFont(fontRegular);

  let program = page.new_segment('0x4004b0', '0x100', 'r-xp', 'program');
  let stack = page.new_segment('0x7fffffff0000', '0x1000', 'rw-p', 'stack0');

  page.map('0x4004b2', '\x90\x55\x90\x59\x90\x0f\x05\xb0\x01\xbf\x02\x00\x00\x00\x0f\x05');

  reg.set('rbp', '0x7fffffff0200');
  reg.set('rsp', '0x7fffffff0200');
  reg.set('rip', '0x4004b2');
  reg.set('rax', 0x0);
  reg.set('rdi', 0x0);
  page.map('0x7fffffff0250', 'ABCDEFG');
  reg.set('rdx', 0x20);
  reg.set('rsi', 0x7fffffff0250);
}

function draw() {
  clear();
  background(255);
  reg_box(600, 270, reg, 0, 16);
  hex_dump(50, 200, page, reg.get('rsp'), '0x80');
  hex_dump(100, 400, page, '0x4004b0', '0x60');
  vmmap_box(550, 200, page);

  executor.next();
}
