var expect = chai.expect;

describe("Cow", function() {
      
  describe("constructor", function() {
    it("should have a default name", function() {
      var cow = new Cow();
      expect(cow.name).to.equal("Anon cow");
    });

    it("should set cow's name if provided", function() {
      var cow = new Cow("Kate");
      expect(cow.name).to.equal("Kate");
    });
  });

  describe("#greets", function() {
    it("should throw if no target is passed in", function() {
      expect(function() {
        (new Cow()).greets();
      }).to.throw(Error);
    });

    it("should greet passed target", function() {
      var greetings = (new Cow("Kate")).greets("Baby");
      expect(greetings).to.equal("Kate greets Baby");
    });
  });
      
  describe("#goodbye", function() {
    it("should throw if no target is passed in", function() {
      expect(function() {
        (new Cow()).goodbye();
      }).to.throw(Error);
    });

    it("should say goodbye to passed target", function() {
      var bye = (new Cow("Kate")).goodbye("Baby");
      expect(bye).to.equal("Kate goodbyes Baby");
    });
  });    

  describe("#adder", function() {
    it("should throw if no target is passed in", function() {
      expect(function() {
        (new Cow()).adder();
      }).to.throw(Error);
    });

    it("should add x and y", function() {
      var sum = (new Cow("Kate")).adder(3, 2);
      expect(sum).to.equal(5);
    });
  });    
    
});