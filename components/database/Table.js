function Colomn(colname) {
  this.name = colname;
  this.attributes = [];
  this.addAttribute = function(attr) {
    this.attributes.push(attr);
  }
}

exports.setName = function(name) {

  this.name = name;
  this.colomns = [];

  this.int = function(colname, length) {
    let col = new Colomn(colname);
    if (length <= 6)
      col.addAttribute("INT(" + length + ")");
    else
      col.addAttribute("BIGINT(" + length + ")");

    this.colomns.push(col);
    return this;
  }

  this.string = function(colname, length) {
    let col = new Colomn(colname);
    col.addAttribute("VARCHAR(" + length + ")");
    this.colomns.push(col);
    return this;
  }

  this.text = function(colname) {
    let col = new Colomn(colname);
    col.addAttribute("TEXT");
    this.colomns.push(col);
    return this;
  }

  this.enum = function(colname, options) {
    let enums = "";
    for (let i = 0; i < options.length; i++) {
      if (i != (options.length - 1))
        enums += "'" + options[i] + "', ";
      else
        enums += "'" + options[i] + "'";
    }

    let col = new Colomn(colname);
    col.addAttribute("ENUM(" + enums + ")");
    this.colomns.push(col);
    return this;
  }

  this.timestamp = function(colname) {
    let col = new Colomn(colname);
    col.addAttribute("TIMESTAMP");
    this.colomns.push(col);
    return this;
  }
  this.date = function(colname) {
    let col = new Colomn(colname);
    col.addAttribute("DATE");
    this.colomns.push(col);
    return this;
  }
  this.float = function(colname) {
    let col = new Colomn(colname);
    col.addAttribute("FLOAT");
    this.colomns.push(col);
    return this;
  }



  this.notnull = function() {
    this.colomns[this.colomns.length - 1].addAttribute("NOT NULL");
    return this;
  }

  this.unique = function() {
    this.colomns[this.colomns.length - 1].addAttribute("UNIQUE");
    return this;
  }

  this.primarykey = function() {
    this.colomns[this.colomns.length - 1].addAttribute("PRIMARY KEY");
    return this;
  }

  this.default = function(value) {
    this.colomns[this.colomns.length - 1].addAttribute('DEFAULT ' + value);
    return this;
  }

  this.unsigned = function() {
    this.colomns[this.colomns.length - 1].addAttribute("UNSIGNED");
    return this;
  }

  this.autoincrement = function() {
    this.colomns[this.colomns.length - 1].addAttribute("AUTO_INCREMENT");
    return this;
  }

  this.addAttribute = function(attr) {
    this.colomns[this.colomns.length - 1].addAttribute(attr);
    return this;
  }

  this.getColomns = function() {
    return this.colomns;
  }

  return this;
}
