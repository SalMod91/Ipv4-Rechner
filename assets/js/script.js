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
hostsInput.addEventListener('input', handleHostInputChange);
subnetsInput.addEventListener('input', handleSubnetInputChange);
document.getElementById('calculateButton').addEventListener('click', function() {

        console.log("It works");

});


cidrSelect.addEventListener('change', function () {cidrChange(this.value);});


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
 * @param {number} currentValue - The current value of the input field.
 * @param {number} maxValue - The maximum allowed value.
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
 * @param {number} cidrValue - The CIDR notation as an integer.
 * @return {number} The maximum number of hosts that can be accommodated within the subnet.
 */
function calculateMaxHosts(cidrValue) {
    const hostBits = 32 - cidrValue;
    return hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;
}

/**
 * Calculates the maximum number of subnets that can be created given the CIDR value.
 * 
 * @param {number} cidrValue - The CIDR notation as an integer.
 * @return {number} The maximum number of subnets that can be created.
 */
function calculateMaxSubnets(cidrValue) {
    // Number of bits available for subnetting
    let subnetBits = 32 - cidrValue;
    
    return Math.pow(2, subnetBits);
}

/**
 * Calculates the maximum number of subnets that can be created based on a specific number of hosts per subnet.
 * 
 * @param {number} cidrValue - The CIDR notation as an integer.
 * @param {number} hostsPerSubnet - The number of hosts required per subnet.
 * @return {number} The maximum number of subnets that can be created.
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
 * @param {number} cidrValue - The CIDR notation as an integer.
 * @param {number} numberOfSubnets - The number of subnets you want to create.
 * @return {number} The maximum number of hosts per subnet.
 */
function calculateMaxHostsPerSubnet(cidrValue, numberOfSubnets) {
    const totalHostBits = 32 - cidrValue;
    const subnetBits = Math.ceil(Math.log2(numberOfSubnets));
    const hostBits = totalHostBits - subnetBits;
    return hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;
}