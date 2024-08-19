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
const hostsInput = document.getElementById('requiredHosts');
const subnetsInput = document.getElementById('numberOfSubnets');


// Event Listeners
cidrSelect.addEventListener('change', function () {cidrChange(this.value);});
hostsInput.addEventListener('input', handleHostInputChange);
subnetsInput.addEventListener('input', handleSubnetInputChange);
document.getElementById('calculateButton').addEventListener('click', function() {
    if (validateInputs()) {
        let ipAddressValue = ipAddress.value.trim();
        let cidrValue = cidrSelect.value.trim();
        let hostsValue = parseInt(hostsInput.value.trim());
        let subnetsValue = parseInt(subnetsInput.value.trim());

        let results = calculateSubnet(ipAddressValue, cidrValue, hostsValue, subnetsValue);
        console.log(results)
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
    let subnetMask = calculateSubnetMask(cidrValue);
    let wildcardMask = calculateWildcardMask(subnetMask);

    visualizeSubnetMask(subnetMask);
    visualizeWildcardMask(wildcardMask);
    updateInputLimits(cidrValue);
}

/**
 * Updates the maximum number of hosts input limit based on the selected CIDR.
 * This function computes the maximum allowable hosts within a subnet and adjusts the input field accordingly.
 * If the current number of hosts exceeds the maximum value, it provides immediate feedback through tooltips.
 * @param {string} - The CIDR notation chosen by the User which gets parsed into an Integer.
 */
function updateInputLimits(cidr) {
    // Removes the slash and parse the CIDR value as an integer.
    const cidrValue = parseInt(cidr.replace('/', ''));
    
    // Calculates maximum hosts and subnets.
    const maxHosts = calculateMaxHosts(cidrValue);
    const maxSubnets = calculateMaxSubnets(cidrValue);

    // Sets the maximum value for the input of hosts.
    hostsInput.max = maxHosts;
    hostsInput.placeholder = "Max " + maxHosts + " hosts";
    
    // Validates and adjust the hosts input if necessary,
    validateAndAdjustInput(hostsInput, parseInt(hostsInput.value), maxHosts, cidrValue);

    // Sets the maximum value for the input of subnets.
    subnetsInput.max = maxSubnets;
    subnetsInput.placeholder = "Max " + maxSubnets + " subnets";

    
    // Validates and adjusts the subnets input if necessary.
    validateAndAdjustInput(subnetsInput, parseInt(subnetsInput.value), maxSubnets);
}

/**
 * Handles input changes on the Host input field by validating and adjusting its value.
 */
function handleHostInputChange() {
    let currentHosts = parseInt(hostsInput.value);
    let cidrValue = parseInt(cidrSelect.value.replace('/', ''));

    // Check if the CIDR value is 31 or 32
    if (cidrValue === 31 || cidrValue === 32) {
        hostsInput.max = 0;
        if (hostsInput.value.trim() === '') {
            hostsInput.value = '';
        } else {
            hostsInput.value = 0;
        }
        return;
    }

    // Check if the host input field is empty
    if (hostsInput.value.trim() === '') {
        // If empty, reset the subnets placeholder and exit the function
        // Calculate max subnets based solely on the CIDR value
        const maxSubnets = calculateMaxSubnets(cidrValue);
        subnetsInput.max = maxSubnets;
        subnetsInput.placeholder = "Max " + maxSubnets + " subnets";

        return;
    }
    
    // Calculate max subnets based on the inputted number of hosts
    const maxSubnets = calculateMaxSubnetsForHosts(cidrValue, currentHosts);
    subnetsInput.max = maxSubnets;
    subnetsInput.placeholder = "Max " + maxSubnets + " subnets";

    // Adjust and validate the input
    validateAndAdjustInput(subnetsInput, parseInt(subnetsInput.value), maxSubnets);

    validateAndAdjustInput(hostsInput, currentHosts, hostsInput.max);
}

/**
 * Handles input changes on the subnet input field by validating and adjusting its value.
 */
function handleSubnetInputChange() {
    let currentSubnets = parseInt(subnetsInput.value);
    let cidrValue = parseInt(cidrSelect.value.replace('/', ''));

    if (subnetsInput.value.trim() === '') {
        const maxHosts = calculateMaxHosts(cidrValue, currentSubnets);
        hostsInput.max = maxHosts;
        hostsInput.placeholder = "Max " + maxHosts + " hosts";
        return;
    }

    const maxHosts = calculateMaxHostsPerSubnet(cidrValue, currentSubnets);
    hostsInput.max = maxHosts;
    hostsInput.placeholder = "Max " + maxHosts + " hosts";

    validateAndAdjustInput(hostsInput, parseInt(hostsInput.value), maxHosts);
    validateAndAdjustInput(subnetsInput, currentSubnets, subnetsInput.max);
}

/**
 * Validates the input against the maximum value and adjusts it if necessary.
 * Also manages tooltips to provide feedback.
 *
 * @param {HTMLElement} inputElement - The input field element.
 * @param {integer} currentValue - The current value of the input field.
 * @param {integer} maxValue - The maximum allowed value.
 */
function validateAndAdjustInput(inputElement, currentValue, maxValue, cidrValue) {
    // Checks if the input field is empty. If it is, it does nothing.
    if (inputElement.value.trim() === '') {
        return;
    }

    // Handles special cases first for /31 and /32.
    if (cidrValue === 32 || cidrValue === 31) {
        if (currentValue !== 0) {
            inputElement.value = 0;
            showTooltip(inputElement, `A CIDR of /${cidrValue} allows 0 hosts.`);
        }
    } 
    // Handles the case where the current value exceeds the maximum allowed value.
    else if (currentValue > maxValue) {
        inputElement.value = maxValue;
        showTooltip(inputElement, `Value adjusted to the maximum allowed: ${maxValue}`);
    } 
    // Handles cases where the current value is less than or equal to 0 for other CIDRs.
    else if (currentValue <= 0) {
        inputElement.value = 1;
        showTooltip(inputElement, `The value cannot be less than 1. It has been automatically set to 1.`);
    } 
    // If the value is valid and within the limits, hides any existing tooltips.
    else {
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

    // Validates Hosts if provided.
    let hostsValue = hostsInput.value.trim();
    if (hostsValue !== '') {
        let hostsNumber = parseInt(hostsValue);
        if (isNaN(hostsNumber) || !validateHosts(cidrNumber, hostsNumber)) {
            showError("Invalid Hosts Value.");
            return false;
        }
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
    const cidrPattern = /^\/(3[0-2]|[1-2]?[0-9])$/;

    return cidrPattern.test(cidr);
}

/**
 * Validates the number of hosts based on the provided CIDR value.
 *
 * This function checks whether the number of hosts specified by the user falls within the valid range for the given CIDR value.
 * The valid range is determined by calculating the maximum number of hosts allowed by
 * the CIDR value.
 * 
 * Ensures that the number of hosts is at least 1.
 *
 * @param {integer} cidrValue - The CIDR notation value that defines the subnet mask.
 * @param {integer} hostsValue - The number of hosts specified by the user.
 * @returns {boolean} - Returns true if the hostsValue is valid, otherwise returns false.
 */
function validateHosts(cidrValue, hostsValue) {
    const maxHosts = calculateMaxHosts(cidrValue);

    // Allows empty input since hosts are optional.
    if (hostsValue === '' || hostsValue === null) {
        return true;
    }

    if ((cidrValue === 32 || cidrValue === 31) && hostsValue === 0) {
        return true;
    }

    if (hostsValue < 1 || hostsValue > maxHosts) {
        return false;
    }

    return true;
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
    const maxSubnets = calculateMaxSubnets(cidrValue);

    // Allows empty input since subnets are optional.
    if (subnetsValue === '' || subnetsValue === null) {
        return true;
    }

    const subnetsNumber = parseInt(subnetsValue);

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
    const cidrToMask = {
        "/32": "255.255.255.255",
        "/31": "255.255.255.254",
        "/30": "255.255.255.252",
        "/29": "255.255.255.248",
        "/28": "255.255.255.240",
        "/27": "255.255.255.224",
        "/26": "255.255.255.192",
        "/25": "255.255.255.128",
        "/24": "255.255.255.0",
        "/23": "255.255.254.0",
        "/22": "255.255.252.0",
        "/21": "255.255.248.0",
        "/20": "255.255.240.0",
        "/19": "255.255.224.0",
        "/18": "255.255.192.0",
        "/17": "255.255.128.0",
        "/16": "255.255.0.0",
        "/15": "255.254.0.0",
        "/14": "255.252.0.0",
        "/13": "255.248.0.0",
        "/12": "255.240.0.0",
        "/11": "255.224.0.0",
        "/10": "255.192.0.0",
        "/9": "255.128.0.0",
        "/8": "255.0.0.0",
        "/7": "254.0.0.0",
        "/6": "252.0.0.0",
        "/5": "248.0.0.0",
        "/4": "240.0.0.0",
        "/3": "224.0.0.0",
        "/2": "192.0.0.0",
        "/1": "128.0.0.0",
        "/0": "0.0.0.0"
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
    const maskOctets = subnetMask.split('.');
    const wildcardOctets = maskOctets.map(octet => 255 - parseInt(octet));
    const wildcardMask = wildcardOctets.join('.');

    return wildcardMask
}

/**
 * Calculates the maximum number of hosts that can be accommodated within a subnet based on the cidr Value.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @return {integer} The maximum number of hosts that can be accommodated within the subnet.
 */
function calculateMaxHosts(cidrValue) {
    const hostBits = 32 - cidrValue;
    return hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;
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
 * Calculates the maximum number of subnets that can be created based on a specific number of hosts per subnet.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @param {integer} hostsPerSubnet - The number of hosts required per subnet.
 * @return {integer} The maximum number of subnets that can be created.
 */
function calculateMaxSubnetsForHosts(cidrValue, hostsPerSubnet) {
    const totalHostBits = 32 - cidrValue;
    const hostBits = Math.ceil(Math.log2(hostsPerSubnet + 2));
    const subnetBits = totalHostBits - hostBits;
    return subnetBits > 0 ? Math.pow(2, subnetBits) : 1;
}

/**
 * Calculates the maximum number of hosts per subnet given a specific number of subnets within a CIDR block.
 * 
 * @param {integer} cidrValue - The CIDR notation as an integer.
 * @param {integer} numberOfSubnets - The number of subnets you want to create.
 * @return {integer} The maximum number of hosts per subnet.
 */
function calculateMaxHostsPerSubnet(cidrValue, numberOfSubnets) {
    const totalHostBits = 32 - cidrValue;
    const subnetBits = Math.ceil(Math.log2(numberOfSubnets));
    const hostBits = totalHostBits - subnetBits;
    return hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;
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
function calculateSubnet(ipAddressValue, cidrValue, hostsValue, subnetsValue) {
    let subnetMask = calculateSubnetMask(cidrValue)
    let wildcardMask = calculateWildcardMask(subnetMask);
    console.log(ipAddressValue)
    console.log(cidrValue)
    console.log(hostsValue)
    console.log(subnetsValue)

    return {
        subnetMask,
        wildcardMask
    }
}