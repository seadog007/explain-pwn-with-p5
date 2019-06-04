class FD{
  constructor(name, handler){
    this.name = name;
    this.handler = handler;
    console.log('new fd: ' + name);
  }
}
