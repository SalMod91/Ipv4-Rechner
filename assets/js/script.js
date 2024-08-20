// Waits for the DOM to be finished loading
document.addEventListener ("DOMContentLoaded", function() {
    initializeTooltips();
    initializeCidrSelection();
});

// DOM Variables
const ipAddress = document.getElementById('ipAddress')
const cidrSelect = document.getElementById('cidrSelect');
const subnetMaskInput = document.getElementById('subnetMask');
const wildcardMaskInput = document.getElementById('wildcardMask');
const hostsInput = document.getElementById('maxHosts');
const subnetsInput = document.getElementById('numberOfSubnets');
const resultsContainer = document.getElementById('results-container');
const subnetResultsContainer = document.getElementById('subnetResultsContainer')


// Event Listeners
cidrSelect.addEventListener('change', function () {cidrChange(this.value);});
subnetsInput.addEventListener('input', handleSubnetInputChange);
document.getElementById('calculateButton').addEventListener('click', function() {
    if (validateInputs()) {
        let ipAddressValue = ipAddress.value.trim();
        let cidrValue = parseInt(cidrSelect.value.replace('/', ''));
        let hostsValue = parseInt(hostsInput.value.trim());
        let subnetsValue = parseInt(subnetsInput.value.trim());

        let results = calculateNetworkDetails(ipAddressValue, cidrValue, hostsValue, subnetsValue);
        console.log(results)
        displayResults(results);

        resultsContainer.style.display = 'block';
    }
});



// FRONT END ------------------------------------------------------------
/**
 * Updates the display of the subnet mask input field in the UI.
 * 
 * @param {string} subnetMask - The subnet mask to display, formatted as a dotted decimal string.
 */
function visualizeSubnetMask(subnetMask) {
    subnetMaskInput.value = subnetMask;
}

/**
 * Updates the display of the wildmask input field in the UI.
 *
 * @param {string} subnetMask - The subnet mask in dotted decimal notation
 */
function visualizeWildcardMask(wildcardMask) {
    wildcardMaskInput.value = wildcardMask;
}

function visualizemaxHosts(maxHosts) {
    hostsInput.value = maxHosts;
}

/**
 * Displays a Bootstrap tooltip with the provided message on the specified input element.
 * The tooltip will automatically hide after 2 seconds.
 * 
 * @param {HTMLElement} inputElement - The input field element where the tooltip should be displayed.
 * @param {string} message - The message to display inside the tooltip.
 */
function showTooltip(inputElement, message) {
    let tooltipInstance = bootstrap.Tooltip.getInstance(inputElement);

    if (!tooltipInstance) {
        tooltipInstance = new bootstrap.Tooltip(inputElement, { title: message, trigger: 'manual' });
    } else {
        tooltipInstance.setContent({ '.tooltip-inner': message });
    }

    tooltipInstance.show();

    setTimeout(function() {
        tooltipInstance.hide();
    }, 2000);
}

/**
 * Hides and disposes an existing tooltip on the specified input element.
 * 
 * @param {HTMLElement} inputElement - The input field element from which the tooltip should be removed.
 */
function hideTooltip(inputElement) {
    let tooltipInstance = bootstrap.Tooltip.getInstance(inputElement);
    if (tooltipInstance) {
        tooltipInstance.dispose();
    }
}

/**
 * Displays the calculated subnet results in the UI.
 *
 * This function updates the UI with the calculated subnet mask, wildcard mask, network and broadcast addresses, 
 * usable IP range, total addresses, and dynamically populates a table with subnet details.
 *
 * @param {Object} results - Contains the calculated network details.
 * @param {string} results.subnetMask - The calculated subnet mask.
 * @param {string} results.wildcardMask - The calculated wildcard mask.
 * @param {string} results.networkAddress - The calculated network address.
 * @param {string} results.broadcastAddress - The calculated broadcast address.
 * @param {Object} results.usableIpRange - The range of usable IP addresses.
 * @param {number} results.totalAddresses - The total number of addresses in the network.
 * @param {Array} [results.subnets] - Optional. An array of subnets with their respective details.
 */
function displayResults(results) {
    document.getElementById('subnetMaskResult').textContent = results.subnetMask;
    document.getElementById('wildcardMaskResult').textContent = results.wildcardMask;
    document.getElementById('networkAddressResult').textContent = results.networkAddress;
    document.getElementById('broadcastAddressResult').textContent = results.broadcastAddress;
    document.getElementById('usableIpsResult').textContent = `Erste nutzbare: ${results.usableIpRange.firstUsable} - Letzte: ${results.usableIpRange.lastUsable}`;
    document.getElementById('totalAddressesResult').textContent = results.totalAddresses;

    let tableBody = document.querySelector('#subnetResultsTable tbody');
    tableBody.innerHTML = '';

    if (results.subnets && results.subnets.length > 0) {
        results.subnets.forEach((subnet, index) => {
            subnetResultsContainer.style.display = 'block';
            let row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${subnet.subnetNumber}</th>
                <td>${subnet.networkAddress}/${subnet.cidr}</td>
                <td>${subnet.networkAddress}</td>
                <td>${subnet.broadcastAddress}</td>
                <td>${subnet.usableIpRange.firstUsable} - ${subnet.usableIpRange.lastUsable}</td>
                <td>${subnet.hostsPerSubnet}</td>
            `;
            tableBody.appendChild(row);
        });

        // Displays warning if the maximum limit of subnets is reached.
        let maxSubnetsToShow = 256;
        if (results.subnets.length === maxSubnetsToShow) {
            let warningMessage = document.createElement('p');
            warningMessage.classList.add('text-warning');
            warningMessage.textContent = `Es werden die ersten ${maxSubnetsToShow} Subnetze angezeigt. Bitte grenzen Sie Ihre Eingabe ein, um detailliertere Ergebnisse zu erhalten.`;
            document.getElementById('subnetResultsContainer').appendChild(warningMessage);
        }
    }
}

// Temporary alert message to debug code.
function showError(message) {
    alert(message);
}

// HANDLERS -------------------------------------------------------------

/**
 * Handles changes to the CIDR selection and updates subnet and wildcard masks accordingly.
 * 
 * This function computes both the subnet and wildcard masks based on the selected CIDR value.
 * It then updates the DOM to reflect these changes.
 * 
 * @param {string} cidrValue - The CIDR notation value selected by the user.
 */
function cidrChange(cidrValue) {
    cidrValue = parseInt(cidrValue.replace('/', ''));
    let subnetMask = calculateSubnetMask(cidrValue);
    let wildcardMask = calculateWildcardMask(subnetMask);
    let maxHosts = calculateMaxHosts(cidrValue)

    visualizeSubnetMask(subnetMask);
    visualizeWildcardMask(wildcardMask);
    visualizemaxHosts(maxHosts)
    updateInputLimits(cidrValue);
}

/**
 * Updates the maximum number of hosts and subnets input limits based on the selected CIDR value.
 * 
 * This function calculates the maximum allowable subnets and hosts within a subnet for the given CIDR value.
 * It then adjusts the relevant input fields and provides feedback to the user via placeholders and tooltips.
 * 
 * @param {number} cidrValue - The CIDR value chosen by the user.
 */
function updateInputLimits(cidrValue) {
    let maxSubnets = calculateMaxSubnets(cidrValue);

    // Sets the maximum value for the input of subnets.
    subnetsInput.max = maxSubnets;
    if (subnetsInput.max == 1) {
        subnetsInput.placeholder = "Max " + maxSubnets + " Subnetz";
    } else {
        subnetsInput.placeholder = "Max " + maxSubnets + " Subnetze";
    }

    // Calculate and update the read-only hosts field based on just the CIDR value
    let maxHosts = calculateMaxHosts(cidrValue);
    hostsInput.value = maxHosts;
}

/**
 * Updates the maximum number of hosts input value based on the selected CIDR and current subnet count.
 * 
 * This function calculates the maximum number of hosts per subnet for the given CIDR value and current subnet count,
 * then updates the input field to reflect this value.
 * 
 * @param {number} cidrValue - The CIDR notation chosen by the user.
 * @param {number} currentSubnets - The current number of subnets.
 */
function updateHostsValue(cidrValue, currentSubnets) {
    let maxHosts = calculateMaxHostsPerSubnet(cidrValue, currentSubnets);
    hostsInput.value = maxHosts;
}

/**
 * Handles input changes on the subnet input field by validating and adjusting its value.
 */
function handleSubnetInputChange() {
    let currentSubnets = parseInt(subnetsInput.value);
    let cidrValue = parseInt(cidrSelect.value.replace('/', ''));

    if (isNaN(currentSubnets) || subnetsInput.value.trim() === '') {
        let maxHosts = calculateMaxHosts(cidrValue);
        hostsInput.value = maxHosts;
    } else {
        updateHostsValue(cidrValue, currentSubnets);
        validateAndAdjustSubnetInput(subnetsInput, currentSubnets, subnetsInput.max, cidrValue);
    }
}

/**
 * Validates the input against the maximum value and adjusts it if necessary.
 * Also manages tooltips to provide feedback.
 *
 * @param {HTMLElement} inputElement - The input field element.
 * @param {integer} currentValue - The current value of the input field.
 * @param {integer} maxValue - The maximum allowed value.
 */
function validateAndAdjustSubnetInput(inputElement, currentValue, maxValue, cidrValue) {
    if (inputElement.value.trim() === '') {
        return;
    } else if (currentValue > maxValue) {
        inputElement.value = maxValue;
        showTooltip(inputElement, `Wert auf das maximal zulässige angepasst: ${maxValue}`);
    } else if (currentValue <= 0) {
        inputElement.value = 1;
        showTooltip(inputElement, `Der Wert kann nicht kleiner als 1 sein. Er wurde automatisch auf 1 gesetzt.`);
        updateHostsValue(cidrValue, 1);
    } else {
        hideTooltip(inputElement);
    }
}

/**
 * Validates all user inputs in a form.
 * 
 * This function is designed to validate various user inputs in a form.
 * 
 * @returns {boolean} Returns true if all validations pass for the IP address and any additional inputs, otherwise returns false.
 */
function validateInputs() {
    // Validates IP Address.
    // .trim() removes any leading or trailing whitespace from the IP address input.
    let ipAddressValue = ipAddress.value.trim();
    if (!validateIpAddress(ipAddressValue)) {
        showError("Invalid IP address.");
        return false;
    }

    // Validates CIDR.
    // .trim() removes any leading or trailing whitespace from the CIDR selection input.
    let cidrValue = cidrSelect.value.trim();
    let cidrNumber = parseInt(cidrValue.replace('/', ''));
    if (isNaN(cidrNumber) || !validateCidr(cidrValue)) {
        showError("Invalid Cidr.");
        return false;
    }

    // Validates Subnets if provided.
    let subnetsValue = subnetsInput.value.trim();
    if (!validateSubnets(cidrNumber, subnetsValue)) {
        showError("Invalid Subnets Value.");
        return false;
    }

    // If all validations pass.
    return true;
}

/**
 * Validates an IPv4 address.
 * 
 * This function checks if the given string is a valid IPv4 address based on the standard IPv4 formatting rules.
 * The address must consist of four decimal octets, each ranging from 0 to 255, separated by dots.
 * It does not allow leading zeros.
 * 
 * @param {string} ipAddress - The IP address to validate.
 * @returns {boolean} Returns true if the IP address is valid, otherwise false.
 */
function validateIpAddress(ipAddress) {
    let ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

    return ipPattern.test(ipAddress);
}

/**
 * Validates whether a given CIDR notation is valid.
 *
 * The function checks if the CIDR notation is in the format "/n", where n is a number
 * between 0 and 32.
 *
 * @param {string} cidr - The CIDR notation to be validated.
 * @returns {boolean} - Returns true if the CIDR notation is valid, otherwise false.
 */
function validateCidr(cidr) {
    let cidrPattern = /^\/(3[0-2]|[1-2]?[0-9])$/;

    return cidrPattern.test(cidr);
}

/**
 * Validates the number of subnets based on the provided CIDR value.
 *
 * This function checks whether the number of subnets specified by the user falls within the valid range for the given CIDR value.
 * The valid range is determined by calculating the maximum number of subnets allowed by the CIDR value.
 * 
 * Ensures that the number of subnets is at least 1 if provided.
 *
 * @param {integer} cidrValue - The CIDR notation value that defines the subnet mask.
 * @param {integer} subnetsValue - The number of subnets specified by the user.
 * @returns {boolean} - Returns true if the subnetsValue is valid, otherwise returns false.
 */
function validateSubnets(cidrValue, subnetsValue) {
    let maxSubnets = calculateMaxSubnets(cidrValue);

    // Allows empty input since subnets are optional.
    if (subnetsValue === '' || subnetsValue === null) {
        return true;
    }

    let subnetsNumber = parseInt(subnetsValue);

    if (isNaN(subnetsNumber) || subnetsNumber < 1 || subnetsNumber > maxSubnets) {
        return false;
    }

    return true;
}

/**
 * Initializes Bootstrap tooltips for elements with the `data-bs-toggle="tooltip"` attribute.
 * 
 * This function selects all elements in the DOM that have the `data-bs-toggle="tooltip"` attribute
 * and initializes a Bootstrap tooltip instance for each of them.
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initializes the CIDR selection behavior on the page.
 * 
 * This function checks if the CIDR dropdown exists on the page. If it does, it 
 * triggers the change event manually to the first option.
 * 
 */
function initializeCidrSelection() {
    if (cidrSelect) {
        // Sets the select element's value to the first option.
        cidrSelect.selectedIndex = 0;
        
        // Triggers the change event manually.
        cidrSelect.dispatchEvent(new Event('change'));
    } else {
        console.log('CIDR select element not found or has no options.');
    }
}

// BUSINESS LOGIC --------------------------
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
