/**
 * Updates the subnet mask input field based on the selected CIDR value.
 *
 * The function maps the selected CIDR to its corresponding
 * subnet mask using a dictionary.
 * When the CIDR value changes, the corresponding subnet mask is automatically updated
 * in the input field.
 * @param {string} cidr - The CIDR notation for which the subnet mask is requested.
 * @return {string} The subnet mask corresponding to the provided CIDR notation in dotted decimal format.
 */
function calculateSubnetMask(cidr) {
    // A dictionary that maps the CIDR values to their corresponding subnet masks
    let cidrToMask = {
        32: "255.255.255.255",
        31: "255.255.255.254",
        30: "255.255.255.252",
        29: "255.255.255.248",
        28: "255.255.255.240",
        27: "255.255.255.224",
        26: "255.255.255.192",
        25: "255.255.255.128",
        24: "255.255.255.0",
        23: "255.255.254.0",
        22: "255.255.252.0",
        21: "255.255.248.0",
        20: "255.255.240.0",
        19: "255.255.224.0",
        18: "255.255.192.0",
        17: "255.255.128.0",
        16: "255.255.0.0",
        15: "255.254.0.0",
        14: "255.252.0.0",
        13: "255.248.0.0",
        12: "255.240.0.0",
        11: "255.224.0.0",
        10: "255.192.0.0",
        9:  "255.128.0.0",
        8:  "255.0.0.0",
        7:  "254.0.0.0",
        6:  "252.0.0.0",
        5:  "248.0.0.0",
        4:  "240.0.0.0",
        3:  "224.0.0.0",
        2:  "192.0.0.0",
        1:  "128.0.0.0",
        0:  "0.0.0.0"
    };

    return cidrToMask[cidr];
}

/**
 * Calculates the wildcard mask based on the subnet mask and updates the wildcard mask input field.
 *
 * Since the wildcard mask is the inverse of the subnet mask, each octet in the subnet mask is subtracted from 255
 * to get the corresponding octet in the wildcard mask.
 *
 * @param {string} subnetMask - The subnet mask in dotted decimal notation
 */
function calculateWildcardMask(subnetMask) {
    let maskOctets = subnetMask.split('.');
    let wildcardOctets = maskOctets.map(octet => 255 - parseInt(octet));
    let wildcardMask = wildcardOctets.join('.');

    return wildcardMask
}

/**
 * Calculates the maximum number of hosts that can be accommodated within a subnet based on the cidr Value.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @return {integer} The maximum number of hosts that can be accommodated within the subnet.
 */
function calculateMaxHosts(cidrValue) {
    let hostBits = 32 - cidrValue;
    return hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;
}

/**
 * Calculates the total number of IP addresses in a subnet given its CIDR value.
 *
 * The total includes all addresses in the subnet, including the network address and the broadcast address.
 *
 * @param {number} cidrValue - The CIDR notation value (e.g., 30 for /30).
 * @returns {number} The total number of IP addresses in the subnet.
 */
function calculateTotalAddresses(cidrValue) {
    let hostBits = 32 - cidrValue;
    return Math.pow(2, hostBits);
}

/**
 * Calculates the maximum number of subnets that can be created given the CIDR value.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @return {integer} The maximum number of subnets that can be created.
 */
function calculateMaxSubnets(cidrValue) {
    // Number of bits available for subnetting
    let subnetBits = 32 - cidrValue;
    
    return Math.pow(2, subnetBits);
}


/**
 * Calculates the maximum number of hosts per subnet given a specific number of subnets within a CIDR block.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @param {integer} numberOfSubnets - The number of subnets you want to create.
 * @return {integer} The maximum number of hosts per subnet.
 */
function calculateMaxHostsPerSubnet(cidrValue, numberOfSubnets) {

    let bitsForSubnets = Math.ceil(Math.log2(numberOfSubnets));
    let newCIDR = cidrValue + bitsForSubnets;
    let effectiveCIDR = Math.min(newCIDR, 32);
    if (newCIDR >= 32) {
        return 0;
    }
    let hostBits = 32 - effectiveCIDR;
    return Math.pow(2, hostBits) - 2;
}

/**
 * Calculates various subnetting details based on the provided IP address, CIDR value, number of hosts, and number of subnets.
 *
 * This function calculates and returns key subnetting values such as the subnet mask, wildcard mask,
 * network address, broadcast address, usable IP range, total number of hosts, and possible subnets.
 * The calculations are based on the provided IP address, CIDR value, and optionally the number of hosts and subnets.
 *
 * @param {string} ipAddressValue - The IP address provided by the user in dotted decimal notation (e.g., "192.168.1.1").
 * @param {integer} cidrValue - The CIDR value provided by the user (e.g., 24 for a /24 subnet).
 * @param {integer} hostsValue - The number of required hosts specified by the user (optional).
 * @param {integer} subnetsValue - The number of required subnets specified by the user (optional).
 * @returns {Object} - An object containing the calculated subnetting values:
 *   @property {string} subnetMask - The calculated subnet mask in dotted decimal notation.
 *   @property {string} wildcardMask - The calculated wildcard mask in dotted decimal notation.
 */
function calculateNetworkDetails(ipAddressValue, cidrValue, hostsValue, subnetsValue) {
    let subnetMask = calculateSubnetMask(cidrValue)
    let wildcardMask = calculateWildcardMask(subnetMask);
    let networkAddress = calculateNetworkAddress(ipAddressValue, subnetMask);
    let broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
    let usableIpRange = calculateUsableIpRange(networkAddress, broadcastAddress);
    let totalAddresses = calculateTotalAddresses(cidrValue)

    let subnets = [];
    if (subnetsValue > 1) {
        subnets = calculateSubnets(networkAddress, cidrValue, subnetsValue);
    }

    console.log(ipAddressValue)
    console.log(cidrValue)
    console.log(hostsValue)
    console.log(subnetsValue)
    console.log(totalAddresses)
    console.log(subnets)


    return {
        subnetMask,
        wildcardMask,
        networkAddress,
        broadcastAddress,
        usableIpRange,
        totalAddresses,
        subnets
    }
}

/**
 * Calculates the network address for a given IP address and subnet mask.
 *
 * The network address is the first address in a subnet and is calculated by performing a bitwise
 * AND operation between the IP address and the subnet mask. The result is the address of the network
 * to which the IP belongs.
 *
 * @param {string} ipAddress - The IP address in dotted decimal format.
 * @param {string} subnetMask - The subnet mask in dotted decimal format.
 * @returns {string} - The network address in dotted decimal format.
 *
 */
function calculateNetworkAddress(ipAddress, subnetMask) {
    let ipOctets = ipAddress.split('.').map(Number);
    let maskOctets = subnetMask.split('.').map(Number);
    
    let networkOctets = ipOctets.map((octet, index) => octet & maskOctets[index]);
    return networkOctets.join('.');
}

/**
 * Calculates the broadcast address for a given network address and subnet mask.
 *
 * The broadcast address is calculated by performing a bitwise OR operation 
 * between the network address and the wildcard mask.
 * The broadcast address is the last address in the subnet, used to send data 
 * to all possible hosts within the subnet.
 *
 * @param {string} networkAddress - The network address in dotted decimal notation.
 * @param {string} subnetMask - The subnet mask in dotted decimal notation.
 * @returns {string} - The calculated broadcast address in dotted decimal notation.
 */
function calculateBroadcastAddress(networkAddress, subnetMask) {
    let networkOctets = networkAddress.split('.').map(Number);
    let maskOctets = subnetMask.split('.').map(Number);

    let broadcastOctets = networkOctets.map((octet, index) => octet | (~maskOctets[index] & 255));
    return broadcastOctets.join('.');
}

/**
 * Calculates the first and last usable IP addresses within a subnet.
 *
 * This function determines the usable IP range by calculating the IP addresses
 * that fall between the network address and the broadcast address. The first
 * usable IP is one greater than the network address, and the last usable IP
 * is one less than the broadcast address.
 *
 * @param {string} networkAddress - The network address of the subnet in dotted decimal notation.
 * @param {string} broadcastAddress - The broadcast address of the subnet in dotted decimal notation.
 * @returns {Object} An object containing the first and last usable IP addresses within the subnet:
 *   - firstUsable: The first usable IP address as a string.
 *   - lastUsable: The last usable IP address as a string.
 */
function calculateUsableIpRange(networkAddress, broadcastAddress) {
    let networkOctets = networkAddress.split('.').map(Number);
    let broadcastOctets = broadcastAddress.split('.').map(Number);

    if (networkAddress === broadcastAddress) {
        return {
            firstUsable: networkAddress,
            lastUsable: broadcastAddress
        };
    }

    let firstUsableIp = [...networkOctets];
    let lastUsableIp = [...broadcastOctets];

    firstUsableIp[3] += 1;
    lastUsableIp[3] -= 1;

    return {
        firstUsable: firstUsableIp.join('.'),
        lastUsable: lastUsableIp.join('.')
    };
}

/**
 * Calculate subnets within the given network address and CIDR.
 *
 * @param {string} networkAddress - The base network address for subnetting.
 * @param {integer} cidrValue - The CIDR value to use as the base for subnetting.
 * @param {integer} subnetsValue - The number of subnets to create.
 * @returns {Array} An array of objects representing each subnet's details.
 */
function calculateSubnets(networkAddress, cidrValue, subnetsValue) {
    let maxSubnetsToShow = 256;
    let subnets = [];
    let newCidrValue = cidrValue + Math.ceil(Math.log2(subnetsValue));
    let subnetIncrement = Math.pow(2, 32 - newCidrValue);
    let hostsPerSubnet = calculateMaxHosts(newCidrValue);

    let currentAddress = ipToLong(networkAddress);

    for (let i = 0; i < subnetsValue && i < maxSubnetsToShow; i++) {
        let subnetNetworkAddress = longToIp(currentAddress);
        let subnetBroadcastAddress = longToIp(currentAddress + subnetIncrement - 1);
        let subnetUsableRange = calculateUsableIpRange(subnetNetworkAddress, subnetBroadcastAddress);

        subnets.push({
            subnetNumber: i + 1,
            cidr: newCidrValue,
            networkAddress: subnetNetworkAddress,
            broadcastAddress: subnetBroadcastAddress,
            usableIpRange: subnetUsableRange, hostsPerSubnet
        });

        currentAddress += subnetIncrement;
    }

    return subnets;
}

/**
 * Convert an IP address from dotted decimal notation to a 32-bit number.
 *
 * @param {string} ip - The IP address in dotted decimal notation.
 * @returns {number} - The IP address as a 32-bit number.
 */
function ipToLong(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet), 0) >>> 0;
}

/**
 * Convert a 32-bit number to an IP address in dotted decimal notation.
 *
 * @param {number} long - The IP address as a 32-bit number.
 * @returns {string} - The IP address in dotted decimal notation.
 */
function longToIp(long) {
    return ((long >>> 24) + '.' +
        (long >> 16 & 255) + '.' +
        (long >> 8 & 255) + '.' +
        (long & 255));
}