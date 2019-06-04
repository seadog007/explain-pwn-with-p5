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
