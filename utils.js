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
