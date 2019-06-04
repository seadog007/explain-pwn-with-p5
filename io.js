class IO{
  constructor(arr){
    this.fds = [];
    this.fdc = 0
    for (let fd of arr){
      console.log(fd);
      this.add(fd);
    }
  }
  add(fd){
    this.fds = this.fds.concat({'id':this.fdc, 'fd': fd});
    this.fdc++;
  }
  find(id){
    for (let i of this.fds){
      if (i.id == id){
        return i.fd;
      }
    }
  }
}
