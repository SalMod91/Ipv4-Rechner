describe('Validation Functions', function() {

  describe('validateIpAddress', function () {

      // Valid IP Address Tests
      it('192.168.1.1 should return true', function () {
          chai.expect(validateIpAddress("192.168.1.1")).to.equal(true);
      });

      it('255.255.255.255 should return true', function () {
          chai.expect(validateIpAddress("255.255.255.255")).to.equal(true);
      });

      it('0.0.0.0 should return true', function () {
          chai.expect(validateIpAddress("0.0.0.0")).to.equal(true);
      });

      it('223.255.255.255 should return true', function () {
          chai.expect(validateIpAddress("223.255.255.255")).to.equal(true);
      });

      // Invalid IP Address Tests
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

      it('-192.168.1.1 should return false', function () {
          chai.expect(validateIpAddress("-192.168.1.1")).to.equal(false);
      });

      it('"" should return false', function () {
          chai.expect(validateIpAddress("")).to.equal(false);
      });

  });

  describe('validateCidr', function () {

      // Valid CIDR Tests
      it('/32 should return true', function () {
          chai.expect(validateCidr("/32")).to.equal(true);
      });

      it('/0 should return true', function () {
          chai.expect(validateCidr("/0")).to.equal(true);
      });

      it('/24 should return true', function () {
          chai.expect(validateCidr("/24")).to.equal(true);
      });

      it('/1 should return true', function () {
          chai.expect(validateCidr("/1")).to.equal(true);
      });

      it('/16 should return true', function () {
          chai.expect(validateCidr("/16")).to.equal(true);
      });

      // Invalid CIDR Tests
      it('/33 should return false', function () {
          chai.expect(validateCidr("/33")).to.equal(false);
      });

      it('/-1 should return false', function () {
          chai.expect(validateCidr("/-1")).to.equal(false);
      });

      it('/ should return false', function () {
          chai.expect(validateCidr("/")).to.equal(false);
      });

      it('32 should return false', function () {
          chai.expect(validateCidr("32")).to.equal(false);
      });

      it('/abc should return false', function () {
          chai.expect(validateCidr("/abc")).to.equal(false);
      });

      it('/3a should return false', function () {
          chai.expect(validateCidr("/3a")).to.equal(false);
      });

      it('Empty string should return false', function () {
          chai.expect(validateCidr("")).to.equal(false);
      });

      it('Null should return false', function () {
          chai.expect(validateCidr(null)).to.equal(false);
      });

      it('Undefined should return false', function () {
          chai.expect(validateCidr(undefined)).to.equal(false);
      });

  });

  describe('validateSubnets', function () {

      // Valid Subnets Tests
      it('Valid subnets with /32 CIDR should return true (1 subnet allowed)', function () {
          chai.expect(validateSubnets(32, 1)).to.equal(true);
      });

      it('Valid subnets with /31 CIDR should return true (2 subnets allowed)', function () {
          chai.expect(validateSubnets(31, 2)).to.equal(true);
      });

      it('Valid subnets with /30 CIDR should return true', function () {
          chai.expect(validateSubnets(30, 4)).to.equal(true);
      });

      it('Valid subnets with /29 CIDR should return true', function () {
          chai.expect(validateSubnets(29, 8)).to.equal(true);
      });

      it('Valid subnets with /24 CIDR should return true', function () {
          chai.expect(validateSubnets(24, 256)).to.equal(true);
      });

      it('Valid subnets with /16 CIDR should return true', function () {
          chai.expect(validateSubnets(16, 65536)).to.equal(true);
      });

      it('Valid subnets with /8 CIDR should return true', function () {
          chai.expect(validateSubnets(8, 16777216)).to.equal(true);
      });

      // Optional Subnets (empty input)
      it('Optional subnets input should return true', function () {
          chai.expect(validateSubnets(24, '')).to.equal(true);
      });

      // Invalid Subnets Tests
      it('Invalid subnets with /30 CIDR should return false (exceeds max subnets allowed)', function () {
          chai.expect(validateSubnets(30, 5)).to.equal(false);
      });

      it('Invalid subnets with /29 CIDR should return false (exceeds max subnets allowed)', function () {
          chai.expect(validateSubnets(29, 9)).to.equal(false);
      });

      it('Invalid subnets with /24 CIDR should return false (exceeds max subnets allowed)', function () {
          chai.expect(validateSubnets(24, 300)).to.equal(false);
      });

      it('Invalid subnets with /16 CIDR should return false (exceeds max subnets allowed)', function () {
          chai.expect(validateSubnets(16, 70000)).to.equal(false);
      });

      it('Invalid subnets with /8 CIDR should return false (exceeds max subnets allowed)', function () {
          chai.expect(validateSubnets(8, 20000000)).to.equal(false);
      });

      it('Invalid subnets with /30 CIDR should return false (0 is not allowed, minimum 1 subnet)', function () {
          chai.expect(validateSubnets(30, 0)).to.equal(false);
      });

      it('Invalid subnets with /29 CIDR should return false (0 is not allowed, minimum 1 subnet)', function () {
          chai.expect(validateSubnets(29, 0)).to.equal(false);
      });

      it('Invalid subnets with /24 CIDR should return false (0 is not allowed, minimum 1 subnet)', function () {
          chai.expect(validateSubnets(24, 0)).to.equal(false);
      });

      it('Invalid subnets with /16 CIDR should return false (0 is not allowed, minimum 1 subnet)', function () {
          chai.expect(validateSubnets(16, 0)).to.equal(false);
      });

      it('Invalid subnets with /8 CIDR should return false (0 is not allowed, minimum 1 subnet)', function () {
          chai.expect(validateSubnets(8, 0)).to.equal(false);
      });

  });

});
describe('Calculation Functions', function() {
  describe('calculateSubnetMask', function () {
    it('should return "0.0.0.0" for /0', function () {
      chai.expect(calculateSubnetMask(0)).to.equal("0.0.0.0");
    });

    it('should return "128.0.0.0" for /1', function () {
      chai.expect(calculateSubnetMask(1)).to.equal("128.0.0.0");
    });

    it('should return "192.0.0.0" for /2', function () {
      chai.expect(calculateSubnetMask(2)).to.equal("192.0.0.0");
    });

    it('should return "224.0.0.0" for /3', function () {
      chai.expect(calculateSubnetMask(3)).to.equal("224.0.0.0");
    });

    it('should return "240.0.0.0" for /4', function () {
      chai.expect(calculateSubnetMask(4)).to.equal("240.0.0.0");
    });

    it('should return "248.0.0.0" for /5', function () {
      chai.expect(calculateSubnetMask(5)).to.equal("248.0.0.0");
    });

    it('should return "252.0.0.0" for /6', function () {
      chai.expect(calculateSubnetMask(6)).to.equal("252.0.0.0");
    });

    it('should return "254.0.0.0" for /7', function () {
      chai.expect(calculateSubnetMask(7)).to.equal("254.0.0.0");
    });

    it('should return "255.0.0.0" for /8', function () {
      chai.expect(calculateSubnetMask(8)).to.equal("255.0.0.0");
    });

    it('should return "255.128.0.0" for /9', function () {
      chai.expect(calculateSubnetMask(9)).to.equal("255.128.0.0");
    });

    it('should return "255.192.0.0" for /10', function () {
      chai.expect(calculateSubnetMask(10)).to.equal("255.192.0.0");
    });

    it('should return "255.224.0.0" for /11', function () {
      chai.expect(calculateSubnetMask(11)).to.equal("255.224.0.0");
    });

    it('should return "255.240.0.0" for /12', function () {
      chai.expect(calculateSubnetMask(12)).to.equal("255.240.0.0");
    });

    it('should return "255.248.0.0" for /13', function () {
      chai.expect(calculateSubnetMask(13)).to.equal("255.248.0.0");
    });

    it('should return "255.252.0.0" for /14', function () {
      chai.expect(calculateSubnetMask(14)).to.equal("255.252.0.0");
    });

    it('should return "255.254.0.0" for /15', function () {
      chai.expect(calculateSubnetMask(15)).to.equal("255.254.0.0");
    });

    it('should return "255.255.0.0" for /16', function () {
      chai.expect(calculateSubnetMask(16)).to.equal("255.255.0.0");
    });

    it('should return "255.255.128.0" for /17', function () {
      chai.expect(calculateSubnetMask(17)).to.equal("255.255.128.0");
    });

    it('should return "255.255.192.0" for /18', function () {
      chai.expect(calculateSubnetMask(18)).to.equal("255.255.192.0");
    });

    it('should return "255.255.224.0" for /19', function () {
      chai.expect(calculateSubnetMask(19)).to.equal("255.255.224.0");
    });

    it('should return "255.255.240.0" for /20', function () {
      chai.expect(calculateSubnetMask(20)).to.equal("255.255.240.0");
    });

    it('should return "255.255.248.0" for /21', function () {
      chai.expect(calculateSubnetMask(21)).to.equal("255.255.248.0");
    });

    it('should return "255.255.252.0" for /22', function () {
      chai.expect(calculateSubnetMask(22)).to.equal("255.255.252.0");
    });

    it('should return "255.255.254.0" for /23', function () {
      chai.expect(calculateSubnetMask(23)).to.equal("255.255.254.0");
    });

    it('should return "255.255.255.0" for /24', function () {
      chai.expect(calculateSubnetMask(24)).to.equal("255.255.255.0");
    });

    it('should return "255.255.255.128" for /25', function () {
      chai.expect(calculateSubnetMask(25)).to.equal("255.255.255.128");
    });

    it('should return "255.255.255.192" for /26', function () {
      chai.expect(calculateSubnetMask(26)).to.equal("255.255.255.192");
    });

    it('should return "255.255.255.224" for /27', function () {
      chai.expect(calculateSubnetMask(27)).to.equal("255.255.255.224");
    });

    it('should return "255.255.255.240" for /28', function () {
      chai.expect(calculateSubnetMask(28)).to.equal("255.255.255.240");
    });

    it('should return "255.255.255.248" for /29', function () {
      chai.expect(calculateSubnetMask(29)).to.equal("255.255.255.248");
    });

    it('should return "255.255.255.252" for /30', function () {
      chai.expect(calculateSubnetMask(30)).to.equal("255.255.255.252");
    });

    it('should return "255.255.255.254" for /31', function () {
      chai.expect(calculateSubnetMask(31)).to.equal("255.255.255.254");
    });

    it('should return "255.255.255.255" for /32', function () {
      chai.expect(calculateSubnetMask(32)).to.equal("255.255.255.255");
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

  describe('calculateMaxHosts', function () {

    it('CIDR /30 should return 2 hosts', function () {
        chai.expect(
            calculateMaxHosts(30)
        ).to.equal(2);
    });

    it('CIDR /24 should return 254 hosts', function () {
        chai.expect(
            calculateMaxHosts(24)
        ).to.equal(254);
    });

    it('CIDR /29 should return 6 hosts', function () {
        chai.expect(
            calculateMaxHosts(29)
        ).to.equal(6);
    });

    it('CIDR /32 should return 0 hosts', function () {
        chai.expect(
            calculateMaxHosts(32)
        ).to.equal(0);
    });

    it('CIDR /31 should return 0 hosts', function () {
        chai.expect(
            calculateMaxHosts(31)
        ).to.equal(0);
    });

    it('CIDR /16 should return 65534 hosts', function () {
        chai.expect(
            calculateMaxHosts(16)
        ).to.equal(65534);
    });

    it('CIDR /8 should return 16777214 hosts', function () {
        chai.expect(
            calculateMaxHosts(8)
        ).to.equal(16777214);
    });

  });

  describe('calculateTotalAddresses', function () {

    it('CIDR /30 should return 4 addresses', function () {
        chai.expect(
            calculateTotalAddresses(30)
        ).to.equal(4);
    });

    it('CIDR /24 should return 256 addresses', function () {
        chai.expect(
            calculateTotalAddresses(24)
        ).to.equal(256);
    });

    it('CIDR /29 should return 8 addresses', function () {
        chai.expect(
            calculateTotalAddresses(29)
        ).to.equal(8);
    });

    it('CIDR /32 should return 1 address', function () {
        chai.expect(
            calculateTotalAddresses(32)
        ).to.equal(1);
    });

    it('CIDR /31 should return 2 addresses', function () {
        chai.expect(
            calculateTotalAddresses(31)
        ).to.equal(2);
    });

    it('CIDR /16 should return 65536 addresses', function () {
        chai.expect(
            calculateTotalAddresses(16)
        ).to.equal(65536);
    });

    it('CIDR /8 should return 16777216 addresses', function () {
        chai.expect(
            calculateTotalAddresses(8)
        ).to.equal(16777216);
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

  describe('calculateNetworkAddress', function () {
    it('Valid network address for 192.168.1.10 with /24 should return 192.168.1.0', function () {
      chai.expect(calculateNetworkAddress('192.168.1.10', '255.255.255.0')).to.equal('192.168.1.0');
    });

    it('Valid network address for 192.168.1.10 with /16 should return 192.168.0.0', function () {
      chai.expect(calculateNetworkAddress('192.168.1.10', '255.255.0.0')).to.equal('192.168.0.0');
    });

    it('Valid network address for 192.168.1.10 with /8 should return 192.0.0.0', function () {
      chai.expect(calculateNetworkAddress('192.168.1.10', '255.0.0.0')).to.equal('192.0.0.0');
    });

    it('Valid network address for 10.0.0.1 with /32 should return 10.0.0.1', function () {
      chai.expect(calculateNetworkAddress('10.0.0.1', '255.255.255.255')).to.equal('10.0.0.1');
    });

    it('Valid network address for 10.0.0.1 with /31 should return 10.0.0.0', function () {
      chai.expect(calculateNetworkAddress('10.0.0.1', '255.255.255.254')).to.equal('10.0.0.0');
    });

    it('Valid network address for 172.16.5.4 with /20 should return 172.16.0.0', function () {
      chai.expect(calculateNetworkAddress('172.16.5.4', '255.255.240.0')).to.equal('172.16.0.0');
    });
  });

  describe('calculateBroadcastAddress', function () {
    it('Valid broadcast address for 192.168.1.0 with /24 should return 192.168.1.255', function () {
      chai.expect(calculateBroadcastAddress('192.168.1.0', '255.255.255.0')).to.equal('192.168.1.255');
    });

    it('Valid broadcast address for 192.168.0.0 with /16 should return 192.168.255.255', function () {
      chai.expect(calculateBroadcastAddress('192.168.0.0', '255.255.0.0')).to.equal('192.168.255.255');
    });

    it('Valid broadcast address for 192.0.0.0 with /8 should return 192.255.255.255', function () {
      chai.expect(calculateBroadcastAddress('192.0.0.0', '255.0.0.0')).to.equal('192.255.255.255');
    });

    it('Valid broadcast address for 10.0.0.1 with /32 should return 10.0.0.1', function () {
      chai.expect(calculateBroadcastAddress('10.0.0.1', '255.255.255.255')).to.equal('10.0.0.1');
    });

    it('Valid broadcast address for 10.0.0.0 with /31 should return 10.0.0.1', function () {
      chai.expect(calculateBroadcastAddress('10.0.0.0', '255.255.255.254')).to.equal('10.0.0.1');
    });

    it('Valid broadcast address for 172.16.0.0 with /20 should return 172.16.15.255', function () {
      chai.expect(calculateBroadcastAddress('172.16.0.0', '255.255.240.0')).to.equal('172.16.15.255');
    });

  });

  describe('calculateUsableIpRange', function () {
    it('Valid usable IP range for network 192.168.1.0 and broadcast 192.168.1.255 should return 192.168.1.1 - 192.168.1.254', function () {
      const result = calculateUsableIpRange('192.168.1.0', '192.168.1.255');
      chai.expect(result.firstUsable).to.equal('192.168.1.1');
      chai.expect(result.lastUsable).to.equal('192.168.1.254');
    });

    it('Valid usable IP range for network 192.168.0.0 and broadcast 192.168.255.255 should return 192.168.0.1 - 192.168.255.254', function () {
      const result = calculateUsableIpRange('192.168.0.0', '192.168.255.255');
      chai.expect(result.firstUsable).to.equal('192.168.0.1');
      chai.expect(result.lastUsable).to.equal('192.168.255.254');
    });

    it('Valid usable IP range for network 192.0.0.0 and broadcast 192.255.255.255 should return 192.0.0.1 - 192.255.255.254', function () {
      const result = calculateUsableIpRange('192.0.0.0', '192.255.255.255');
      chai.expect(result.firstUsable).to.equal('192.0.0.1');
      chai.expect(result.lastUsable).to.equal('192.255.255.254');
    });

    it('Valid usable IP range for network 10.0.0.1 and broadcast 10.0.0.1 (single host /32) should return 10.0.0.1 - 10.0.0.1', function () {
      const result = calculateUsableIpRange('10.0.0.1', '10.0.0.1');
      chai.expect(result.firstUsable).to.equal('10.0.0.1');
      chai.expect(result.lastUsable).to.equal('10.0.0.1');
    });

    it('Valid usable IP range for network 10.0.0.0 and broadcast 10.0.0.1 (/31) should return 10.0.0.0 - 10.0.0.1', function () {
      const result = calculateUsableIpRange('10.0.0.0', '10.0.0.1');
      chai.expect(result.firstUsable).to.equal('10.0.0.1');
      chai.expect(result.lastUsable).to.equal('10.0.0.0');
    });

    it('Valid usable IP range for network 172.16.0.0 and broadcast 172.16.15.255 should return 172.16.0.1 - 172.16.15.254', function () {
      const result = calculateUsableIpRange('172.16.0.0', '172.16.15.255');
      chai.expect(result.firstUsable).to.equal('172.16.0.1');
      chai.expect(result.lastUsable).to.equal('172.16.15.254');
    });

  });

  describe('calculateNetworkDetails', function() {
    it('should return correct details for a /24 network', function() {
        const details = calculateNetworkDetails('192.168.1.1', 24, undefined, 1);
        chai.expect(details.subnetMask).to.equal('255.255.255.0');
        chai.expect(details.wildcardMask).to.equal('0.0.0.255');
        chai.expect(details.networkAddress).to.equal('192.168.1.0');
        chai.expect(details.broadcastAddress).to.equal('192.168.1.255');
        chai.expect(details.usableIpRange.firstUsable).to.equal('192.168.1.1');
        chai.expect(details.usableIpRange.lastUsable).to.equal('192.168.1.254');
        chai.expect(details.totalAddresses).to.equal(256);
        chai.expect(details.subnets).to.deep.equal([]); // No subnets calculated
    });

    it('should calculate subnets correctly for a /24 network when subnetsValue > 1', function() {
        const details = calculateNetworkDetails('192.168.1.1', 24, undefined, 4);
        chai.expect(details.subnetMask).to.equal('255.255.255.0');
        chai.expect(details.wildcardMask).to.equal('0.0.0.255');
        chai.expect(details.networkAddress).to.equal('192.168.1.0');
        chai.expect(details.broadcastAddress).to.equal('192.168.1.255');
        chai.expect(details.usableIpRange.firstUsable).to.equal('192.168.1.1');
        chai.expect(details.usableIpRange.lastUsable).to.equal('192.168.1.254');
        chai.expect(details.totalAddresses).to.equal(256); // Total addresses should include network and broadcast addresses
        chai.expect(details.subnets).to.be.an('array').that.is.not.empty; // Check for non-empty subnets array
    });

    it('should handle a /30 network with minimal hosts', function() {
        const details = calculateNetworkDetails('192.168.1.4', 30, undefined, 1);
        chai.expect(details.subnetMask).to.equal('255.255.255.252');
        chai.expect(details.wildcardMask).to.equal('0.0.0.3');
        chai.expect(details.networkAddress).to.equal('192.168.1.4');
        chai.expect(details.broadcastAddress).to.equal('192.168.1.7');
        chai.expect(details.usableIpRange.firstUsable).to.equal('192.168.1.5');
        chai.expect(details.usableIpRange.lastUsable).to.equal('192.168.1.6');
        chai.expect(details.totalAddresses).to.equal(4); // Total addresses including network and broadcast
        chai.expect(details.subnets).to.deep.equal([]);
    });

    it('should handle a /32 network with no additional hosts or subnets', function() {
        const details = calculateNetworkDetails('192.168.1.1', 32, undefined, 1);
        chai.expect(details.subnetMask).to.equal('255.255.255.255');
        chai.expect(details.wildcardMask).to.equal('0.0.0.0');
        chai.expect(details.networkAddress).to.equal('192.168.1.1');
        chai.expect(details.broadcastAddress).to.equal('192.168.1.1');
        chai.expect(details.usableIpRange.firstUsable).to.equal('192.168.1.1');
        chai.expect(details.usableIpRange.lastUsable).to.equal('192.168.1.1');
        chai.expect(details.totalAddresses).to.equal(1); // /32 network has only 1 address
        chai.expect(details.subnets).to.deep.equal([]);
    });

    it('should handle large networks like a /8 correctly', function() {
        const details = calculateNetworkDetails('10.0.0.1', 8, undefined, 1);
        chai.expect(details.subnetMask).to.equal('255.0.0.0');
        chai.expect(details.wildcardMask).to.equal('0.255.255.255');
        chai.expect(details.networkAddress).to.equal('10.0.0.0');
        chai.expect(details.broadcastAddress).to.equal('10.255.255.255');
        chai.expect(details.usableIpRange.firstUsable).to.equal('10.0.0.1');
        chai.expect(details.usableIpRange.lastUsable).to.equal('10.255.255.254');
        chai.expect(details.totalAddresses).to.equal(16777216); // Total addresses in a /8
        chai.expect(details.subnets).to.deep.equal([]);
    });
  });
});

describe('IP Address Conversion Functions', function () {
  describe('ipToLong', function () {
      it('should convert "192.168.1.1" to 3232235777', function () {
          chai.expect(ipToLong('192.168.1.1')).to.equal(3232235777);
      });

      it('should convert "0.0.0.0" to 0', function () {
          chai.expect(ipToLong('0.0.0.0')).to.equal(0);
      });

      it('should convert "255.255.255.255" to 4294967295', function () {
          chai.expect(ipToLong('255.255.255.255')).to.equal(4294967295);
      });

      it('should handle IPs with leading zeros, e.g., "192.168.01.001"', function () {
          chai.expect(ipToLong('192.168.01.001')).to.equal(3232235777);
      });
  });

  describe('longToIp', function () {
      it('should convert 3232235777 to "192.168.1.1"', function () {
          chai.expect(longToIp(3232235777)).to.equal('192.168.1.1');
      });

      it('should convert 0 to "0.0.0.0"', function () {
          chai.expect(longToIp(0)).to.equal('0.0.0.0');
      });

      it('should convert 4294967295 to "255.255.255.255"', function () {
          chai.expect(longToIp(4294967295)).to.equal('255.255.255.255');
      });

      it('should handle numbers outside the valid 32-bit range gracefully', function () {
          chai.expect(longToIp(-1)).to.equal('255.255.255.255');
      });
  });
});