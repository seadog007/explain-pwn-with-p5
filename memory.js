class Memory{
  constructor(length){
    this.length = length;
    let buffer = new ArrayBuffer(length.toString())
    this.data = new DataView(buffer);
  }
  get(position){
    return this.data.getUint8(position);
  }
  set(position, value){
    return this.data.setUint8(position, value);
  }
}
