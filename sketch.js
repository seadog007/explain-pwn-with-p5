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
  createCanvas(1000, 800);
  textFont(fontRegular);
  frameRate(1);

  let program = page.new_segment('0x4004b0', '0x100', 'r-xp', 'program');
  let stack = page.new_segment('0x7fffffff0000', '0x1000', 'rw-p', 'stack0');

  page.map('0x4004b2', '\x55\x48\x89\xe5\x89\x7d\xfc\x8b\x45\xfc\x0f\xaf\xc0\x5d\xc3');

  reg.set('rbp', '0x7fffffff0200');
  reg.set('rsp', '0x7fffffff0200');
  reg.set('rip', '0x4004b2');
  reg.set('rax', 0x0);
  reg.set('rdi', 0x0);
  page.map('0x7fffffff0250', 'ABCDEFG');
  reg.set('rdx', 0x20);
  reg.set('rsi', 0x7fffffff0250);
  reg.set('rdi', 0xabcdef012345);
}

function draw() {
  clear();
  background(255);
  hex_dump(10, 70, page, reg.get('rsp'), '0x80', 'Stack');
  hex_dump(10, 215, page, '0x4004b0', '0x60', 'Program');
  ins_box(10, 330, executor);

  vmmap_box(10, 10, page);

  reg_box(500, 10, reg, 0, 16);

  executor.next();
}
