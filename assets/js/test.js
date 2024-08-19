describe('calculateSubnetMask', function () {

  it('should return "255.255.254.0"', function () {
    chai.expect(
      calculateSubnetMask("/23")
    ).to.equal("255.255.254.0");
  });

  it('should return "255.255.255.255"', function () {
    chai.expect(
      calculateSubnetMask("/32")
    ).to.equal("255.255.255.255");
  });

  it('should return 252.0.0.0', function () {
    chai.expect(
      calculateSubnetMask("/6")
    ).to.equal("252.0.0.0");
  });

});

describe('calculateWildcardMask', function () {

  it('should return 0.0.0.0', function () {
    chai.expect(
      calculateWildcardMask("255.255.255.255")
    ).to.equal("0.0.0.0");
  });

  it('should return 3.255.255.255', function () {
    chai.expect(
      calculateWildcardMask("252.0.0.0")
    ).to.equal("3.255.255.255");
  });
});

describe('calculateMaxSubnets', function () {

    it('2 hosts and 25 cidr should return 32', function () {
      chai.expect(
        calculateMaxSubnets(2, 25)
      ).to.equal(32);
    });

    it('255 hosts should return 1', function () {
      chai.expect(
        calculateMaxSubnets(2)
      ).to.equal(1);
    });

});

describe('validateIpAddress', function () {

  it('192.168.1.1 should return true', function () {
    chai.expect(validateIpAddress("192.168.1.1")).to.equal(true);
  });

  it('255.255.255.255 should return true', function () {
    chai.expect(validateIpAddress("255.255.255.255")).to.equal(true);
  });

  it('0.0.0.0 should return true', function () {
    chai.expect(validateIpAddress("0.0.0.0")).to.equal(true);
  });

  it('256.0.0.1 should return false', function () {
    chai.expect(validateIpAddress("256.0.0.1")).to.equal(false);
  });

  it('192.168.1 should return false', function () {
    chai.expect(validateIpAddress("192.168.1")).to.equal(false);
  });

  it('192.168.1.1.1 should return false', function () {
    chai.expect(validateIpAddress("192.168.1.1.1")).to.equal(false);
  });

  it('192.168.abc.1 should return false', function () {
    chai.expect(validateIpAddress("192.168.abc.1")).to.equal(false);
  });

  it('192.168.1.1@ should return false', function () {
    chai.expect(validateIpAddress("192.168.1.1@")).to.equal(false);
  });

  it('192.168.001.001 should return false', function () {
    chai.expect(validateIpAddress("192.168.001.001")).to.equal(false);
  });

  it('223.255.255.255 should return true', function () {
    chai.expect(validateIpAddress("223.255.255.255")).to.equal(true);
  });
  

  it('-192.168.1.1 should return false', function () {
    chai.expect(validateIpAddress("-192.168.1.1")).to.equal(false);
  });

  it('"" should return false', function () {
    chai.expect(validateIpAddress("")).to.equal(false);
  });

});