class Parser {
  parse(buffer, base) {
    let d = new cs.Capstone(cs.ARCH_X86, cs.MODE_64);
    let instructions = d.disasm(buffer, base);
    return instructions[0];
  }
}
