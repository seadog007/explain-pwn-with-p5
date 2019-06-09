function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function overlap(min1, max1, min2, max2) {
  return bimax(0, bimin(max1, max2) - bimax(min1, min2))
}

function bimax(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}

function bimin(a, b) {
  if (a < b) {
    return a;
  }
  return b;
}

function hex_to_ascii(str1)
{
  var hex  = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

function reverseString(str) {
  if (str === "")
    return "";
  else
    return reverseString(str.substr(1)) + str.charAt(0);
}

// convert bytes to chars
function btoc(b) {
  return b.map(b => String.fromCharCode(b)).join('');
}

// convert chars to bytes
function ctob(c) {
  return Array.from(c).map(c => c.charCodeAt(0));
}

// format byte to hex format string
function byte_to_hex(b) {
  return '0x' + (b < 0x10 ? '0' + b.toString(0x10) : b.toString(0x10));
}

function little_endian_to_number(data){
  let sum = BigInt(0);
  for (let i = data.length - 1; i >= 0; i--) {
    sum += BigInt(data[i]) * (BigInt(256) ** BigInt(i));
  }
  return sum;
}

function little_endian_number_to_string(data){
  return reverseString(hex_to_ascii(data));
}

function is_general_register(reg){
  let list64 = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];
  let list32 = ['eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi', 'r8d', 'r9d', 'r10d', 'r11d', 'r12d', 'r13d', 'r14d', 'r15d'];
  let list16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di', 'r8w', 'r9w', 'r10w','r11w', 'r12w', 'r13w', 'r14w', 'r15w'];
  let list8_h = ['ah','ch', 'dh', 'bh'];
  let list8 = ['al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil', '8ip', 'r8b', 'r9b', 'r10b', 'r11b', 'r12b', 'r13b', 'r14b', 'r15b'].concat(list8_h);
  if (list64.indexOf(reg.toLowerCase()) >= 0){
    return 8;
  }
  if (list32.indexOf(reg.toLowerCase()) >= 0){
    return 4;
  }
  if (list16.indexOf(reg.toLowerCase()) >= 0){
    return 2;
  }
  if (list8.indexOf(reg.toLowerCase()) >= 0){
    return 1;
  }
  return false;
}

function is_hex(str){
  const regex = /^0x[0-9a-f]+$/i;
  if ((m = regex.exec(str)) !== null) {
    return true;
  }
  return false;
}

function parse_ptr(reg, str){
  str = str.split(' ').slice(2);
  if (str.length > 1){
    // complicated ptr
    str = str.join(' ');
    str = str.substring(1, str.length - 1).split(' ');
    for (i in str){
      if (is_general_register(str[i])){
        str[i] = 'BigInt(\'0x' + reg.get(str[i]).toString(16) + '\')';
      }else if (!['+', '-', '*'].includes(str[i])){
        str[i] = 'BigInt(\'' + str[i] + '\')';
      }
    }
    str = str.join('');
    // Someone please fix this
    str = eval(str);
    return str;
  } else {
    str = str[0].substring(1, str[0].length - 1)
    return reg.get(str);
  }
  return undefined;
}

function parse_mov_size(str){
  let size = [
    {'str': 'byte', 'size': 1},
    {'str': 'word', 'size': 2},
    {'str': 'dword', 'size': 4},
    {'str': 'qword', 'size': 8}
  ];
  str = str.split(' ')[0];
  for (t of size){
    if (t.str == str){
      return t.size;
    }
  }
  return undefined;
}
