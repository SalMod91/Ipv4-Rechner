describe('calculateSubnetMask', function () {
  it('should return "0.0.0.0" for /0', function () {
    chai.expect(calculateSubnetMask("/0")).to.equal("0.0.0.0");
  });

  it('should return "128.0.0.0" for /1', function () {
    chai.expect(calculateSubnetMask("/1")).to.equal("128.0.0.0");
  });

  it('should return "192.0.0.0" for /2', function () {
    chai.expect(calculateSubnetMask("/2")).to.equal("192.0.0.0");
  });

  it('should return "224.0.0.0" for /3', function () {
    chai.expect(calculateSubnetMask("/3")).to.equal("224.0.0.0");
  });

  it('should return "240.0.0.0" for /4', function () {
    chai.expect(calculateSubnetMask("/4")).to.equal("240.0.0.0");
  });

  it('should return "248.0.0.0" for /5', function () {
    chai.expect(calculateSubnetMask("/5")).to.equal("248.0.0.0");
  });

  it('should return "252.0.0.0" for /6', function () {
    chai.expect(calculateSubnetMask("/6")).to.equal("252.0.0.0");
  });

  it('should return "254.0.0.0" for /7', function () {
    chai.expect(calculateSubnetMask("/7")).to.equal("254.0.0.0");
  });

  it('should return "255.0.0.0" for /8', function () {
    chai.expect(calculateSubnetMask("/8")).to.equal("255.0.0.0");
  });

  it('should return "255.128.0.0" for /9', function () {
    chai.expect(calculateSubnetMask("/9")).to.equal("255.128.0.0");
  });

  it('should return "255.192.0.0" for /10', function () {
    chai.expect(calculateSubnetMask("/10")).to.equal("255.192.0.0");
  });

  it('should return "255.224.0.0" for /11', function () {
    chai.expect(calculateSubnetMask("/11")).to.equal("255.224.0.0");
  });

  it('should return "255.240.0.0" for /12', function () {
    chai.expect(calculateSubnetMask("/12")).to.equal("255.240.0.0");
  });

  it('should return "255.248.0.0" for /13', function () {
    chai.expect(calculateSubnetMask("/13")).to.equal("255.248.0.0");
  });

  it('should return "255.252.0.0" for /14', function () {
    chai.expect(calculateSubnetMask("/14")).to.equal("255.252.0.0");
  });

  it('should return "255.254.0.0" for /15', function () {
    chai.expect(calculateSubnetMask("/15")).to.equal("255.254.0.0");
  });

  it('should return "255.255.0.0" for /16', function () {
    chai.expect(calculateSubnetMask("/16")).to.equal("255.255.0.0");
  });

  it('should return "255.255.128.0" for /17', function () {
    chai.expect(calculateSubnetMask("/17")).to.equal("255.255.128.0");
  });

  it('should return "255.255.192.0" for /18', function () {
    chai.expect(calculateSubnetMask("/18")).to.equal("255.255.192.0");
  });

  it('should return "255.255.224.0" for /19', function () {
    chai.expect(calculateSubnetMask("/19")).to.equal("255.255.224.0");
  });

  it('should return "255.255.240.0" for /20', function () {
    chai.expect(calculateSubnetMask("/20")).to.equal("255.255.240.0");
  });

  it('should return "255.255.248.0" for /21', function () {
    chai.expect(calculateSubnetMask("/21")).to.equal("255.255.248.0");
  });

  it('should return "255.255.252.0" for /22', function () {
    chai.expect(calculateSubnetMask("/22")).to.equal("255.255.252.0");
  });

  it('should return "255.255.254.0" for /23', function () {
    chai.expect(calculateSubnetMask("/23")).to.equal("255.255.254.0");
  });

  it('should return "255.255.255.0" for /24', function () {
    chai.expect(calculateSubnetMask("/24")).to.equal("255.255.255.0");
  });

  it('should return "255.255.255.128" for /25', function () {
    chai.expect(calculateSubnetMask("/25")).to.equal("255.255.255.128");
  });

  it('should return "255.255.255.192" for /26', function () {
    chai.expect(calculateSubnetMask("/26")).to.equal("255.255.255.192");
  });

  it('should return "255.255.255.224" for /27', function () {
    chai.expect(calculateSubnetMask("/27")).to.equal("255.255.255.224");
  });

  it('should return "255.255.255.240" for /28', function () {
    chai.expect(calculateSubnetMask("/28")).to.equal("255.255.255.240");
  });

  it('should return "255.255.255.248" for /29', function () {
    chai.expect(calculateSubnetMask("/29")).to.equal("255.255.255.248");
  });

  it('should return "255.255.255.252" for /30', function () {
    chai.expect(calculateSubnetMask("/30")).to.equal("255.255.255.252");
  });

  it('should return "255.255.255.254" for /31', function () {
    chai.expect(calculateSubnetMask("/31")).to.equal("255.255.255.254");
  });

  it('should return "255.255.255.255" for /32', function () {
    chai.expect(calculateSubnetMask("/32")).to.equal("255.255.255.255");
  });
});

describe('calculateWildcardMask', function () {
  it('should return "255.255.255.255" for "0.0.0.0"', function () {
    chai.expect(calculateWildcardMask("0.0.0.0")).to.equal("255.255.255.255");
  });

  it('should return "127.255.255.255" for "128.0.0.0"', function () {
    chai.expect(calculateWildcardMask("128.0.0.0")).to.equal("127.255.255.255");
  });

  it('should return "63.255.255.255" for "192.0.0.0"', function () {
    chai.expect(calculateWildcardMask("192.0.0.0")).to.equal("63.255.255.255");
  });

  it('should return "31.255.255.255" for "224.0.0.0"', function () {
    chai.expect(calculateWildcardMask("224.0.0.0")).to.equal("31.255.255.255");
  });

  it('should return "15.255.255.255" for "240.0.0.0"', function () {
    chai.expect(calculateWildcardMask("240.0.0.0")).to.equal("15.255.255.255");
  });

  it('should return "7.255.255.255" for "248.0.0.0"', function () {
    chai.expect(calculateWildcardMask("248.0.0.0")).to.equal("7.255.255.255");
  });

  it('should return "3.255.255.255" for "252.0.0.0"', function () {
    chai.expect(calculateWildcardMask("252.0.0.0")).to.equal("3.255.255.255");
  });

  it('should return "1.255.255.255" for "254.0.0.0"', function () {
    chai.expect(calculateWildcardMask("254.0.0.0")).to.equal("1.255.255.255");
  });

  it('should return "0.255.255.255" for "255.0.0.0"', function () {
    chai.expect(calculateWildcardMask("255.0.0.0")).to.equal("0.255.255.255");
  });

  it('should return "0.127.255.255" for "255.128.0.0"', function () {
    chai.expect(calculateWildcardMask("255.128.0.0")).to.equal("0.127.255.255");
  });

  it('should return "0.63.255.255" for "255.192.0.0"', function () {
    chai.expect(calculateWildcardMask("255.192.0.0")).to.equal("0.63.255.255");
  });

  it('should return "0.31.255.255" for "255.224.0.0"', function () {
    chai.expect(calculateWildcardMask("255.224.0.0")).to.equal("0.31.255.255");
  });

  it('should return "0.15.255.255" for "255.240.0.0"', function () {
    chai.expect(calculateWildcardMask("255.240.0.0")).to.equal("0.15.255.255");
  });

  it('should return "0.7.255.255" for "255.248.0.0"', function () {
    chai.expect(calculateWildcardMask("255.248.0.0")).to.equal("0.7.255.255");
  });

  it('should return "0.3.255.255" for "255.252.0.0"', function () {
    chai.expect(calculateWildcardMask("255.252.0.0")).to.equal("0.3.255.255");
  });

  it('should return "0.1.255.255" for "255.254.0.0"', function () {
    chai.expect(calculateWildcardMask("255.254.0.0")).to.equal("0.1.255.255");
  });

  it('should return "0.0.255.255" for "255.255.0.0"', function () {
    chai.expect(calculateWildcardMask("255.255.0.0")).to.equal("0.0.255.255");
  });

  it('should return "0.0.127.255" for "255.255.128.0"', function () {
    chai.expect(calculateWildcardMask("255.255.128.0")).to.equal("0.0.127.255");
  });

  it('should return "0.0.63.255" for "255.255.192.0"', function () {
    chai.expect(calculateWildcardMask("255.255.192.0")).to.equal("0.0.63.255");
  });

  it('should return "0.0.31.255" for "255.255.224.0"', function () {
    chai.expect(calculateWildcardMask("255.255.224.0")).to.equal("0.0.31.255");
  });

  it('should return "0.0.15.255" for "255.255.240.0"', function () {
    chai.expect(calculateWildcardMask("255.255.240.0")).to.equal("0.0.15.255");
  });

  it('should return "0.0.7.255" for "255.255.248.0"', function () {
    chai.expect(calculateWildcardMask("255.255.248.0")).to.equal("0.0.7.255");
  });

  it('should return "0.0.3.255" for "255.255.252.0"', function () {
    chai.expect(calculateWildcardMask("255.255.252.0")).to.equal("0.0.3.255");
  });

  it('should return "0.0.1.255" for "255.255.254.0"', function () {
    chai.expect(calculateWildcardMask("255.255.254.0")).to.equal("0.0.1.255");
  });

  it('should return "0.0.0.255" for "255.255.255.0"', function () {
    chai.expect(calculateWildcardMask("255.255.255.0")).to.equal("0.0.0.255");
  });

  it('should return "0.0.0.127" for "255.255.255.128"', function () {
    chai.expect(calculateWildcardMask("255.255.255.128")).to.equal("0.0.0.127");
  });

  it('should return "0.0.0.63" for "255.255.255.192"', function () {
    chai.expect(calculateWildcardMask("255.255.255.192")).to.equal("0.0.0.63");
  });

  it('should return "0.0.0.31" for "255.255.255.224"', function () {
    chai.expect(calculateWildcardMask("255.255.255.224")).to.equal("0.0.0.31");
  });

  it('should return "0.0.0.15" for "255.255.255.240"', function () {
    chai.expect(calculateWildcardMask("255.255.255.240")).to.equal("0.0.0.15");
  });

  it('should return "0.0.0.7" for "255.255.255.248"', function () {
    chai.expect(calculateWildcardMask("255.255.255.248")).to.equal("0.0.0.7");
  });

  it('should return "0.0.0.3" for "255.255.255.252"', function () {
    chai.expect(calculateWildcardMask("255.255.255.252")).to.equal("0.0.0.3");
  });

  it('should return "0.0.0.1" for "255.255.255.254"', function () {
    chai.expect(calculateWildcardMask("255.255.255.254")).to.equal("0.0.0.1");
  });

  it('should return "0.0.0.0" for "255.255.255.255"', function () {
    chai.expect(calculateWildcardMask("255.255.255.255")).to.equal("0.0.0.0");
  });
});

describe('calculateMaxSubnets', function () {

  it('CIDR /25 should return 128 subnets', function () {
      chai.expect(
          calculateMaxSubnets(25)
      ).to.equal(128);
  });

  it('CIDR /30 should return 4 subnets', function () {
      chai.expect(
          calculateMaxSubnets(30)
      ).to.equal(4);
  });

  it('CIDR /32 should return 1 subnet', function () {
      chai.expect(
          calculateMaxSubnets(32)
      ).to.equal(1);
  });

  it('CIDR /24 should return 256 subnets', function () {
      chai.expect(
          calculateMaxSubnets(24)
      ).to.equal(256);
  });

  it('CIDR /16 should return 65536 subnets', function () {
      chai.expect(
          calculateMaxSubnets(16)
      ).to.equal(65536);
  });

  it('CIDR /8 should return 16777216 subnets', function () {
      chai.expect(
          calculateMaxSubnets(8)
      ).to.equal(16777216);
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