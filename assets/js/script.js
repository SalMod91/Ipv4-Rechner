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
const requiredHostsInput = document.getElementById('requiredHosts');
const requiredSubnetsInput = document.getElementById('numberOfSubnets');

// Event Listeners
requiredHostsInput.addEventListener('input', handleHostInputChange);

/**
 * Updates the subnet mask input field based on the selected CIDR value.
 *
 * The function maps the selected CIDR to its corresponding
 * subnet mask using a dictionary.
 * When the CIDR value changes, the corresponding subnet mask is automatically updated
 * in the input field.
 */
function updateSubnetMask() {
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

    // Update the Subnetmask input field based on CIDR selection
    subnetMaskInput.value = cidrToMask[cidrSelect.value];

    // Calculate and update the Wildcard Mask input field
    updateWildcardMask(cidrToMask[cidrSelect.value]);
}

/**
 * Calculates the wildcard mask based on the subnet mask and updates the wildcard mask input field.
 *
 * Since the wildcard mask is the inverse of the subnet mask, each octet in the subnet mask is subtracted from 255
 * to get the corresponding octet in the wildcard mask.
 *
 * @param {string} subnetMask - The subnet mask in dotted decimal notation
 */
function updateWildcardMask(subnetMask) {
    const wildcardMask = calculateWildcardMask(subnetMask);
    wildcardMaskInput.value = wildcardMask;
}

/**
 * Updates the maximum number of hosts input limit based on the selected CIDR.
 * This function computes the maximum allowable hosts within a subnet and adjusts the input field accordingly.
 * If the current number of hosts exceeds the maximum value, it provides immediate feedback through tooltips.
 * @param {string} - The CIDR notation chosen by the User which gets parsed into an Integer.
 */
function updateHostInputLimit(cidr) {
    // Removes the slash and parse the CIDR value as an integer.
    const cidrValue = parseInt(cidr.replace('/', ''));
    
    // Calculates the number of bits available for host addresses.
    const hostBits = 32 - cidrValue;
    
    // Calculates the maximum number of hosts available within the subnet.
    // If there are no Host bits available, the maximum number of hosts is set to 0.
    const maxHosts = hostBits > 0 ? Math.pow(2, hostBits) - 2 : 0;

    // Sets the maximum value for the input of hosts.
    requiredHostsInput.max = maxHosts;
    
    // Indicates in the placeholder the max value of hosts possible.
    requiredHostsInput.placeholder = "Max " + maxHosts + " hosts";

    // Updates the title attribute for the new tooltip content.
    requiredHostsInput.setAttribute('title', `Value adjusted to the maximum allowed: ${maxHosts}`);

    validateAndAdjustInput(requiredHostsInput, parseInt(requiredHostsInput.value), maxHosts);
}

/**
 * Handles input changes on the Host input field by validating and adjusting its value.
 */
function handleHostInputChange() {
    const currentValue = parseInt(this.value);
    const maxValue = parseInt(this.max);

    validateAndAdjustInput(this, currentValue, maxValue);
}

/**
 * Validates the input against the maximum value and adjusts it if necessary.
 * Also manages tooltips to provide feedback.
 *
 * @param {HTMLElement} inputElement - The input field element.
 * @param {number} currentValue - The current value of the input field.
 * @param {number} maxValue - The maximum allowed value.
 */
function validateAndAdjustInput(inputElement, currentValue, maxValue) {
    // Gets or creates a tooltip instance.
    let tooltipInstance = bootstrap.Tooltip.getInstance(inputElement);

    if (!tooltipInstance) {
        // Initializes tooltip with manual trigger if not already done.
        tooltipInstance = new bootstrap.Tooltip(inputElement, { trigger: 'manual' });
    }

    if (currentValue > maxValue) {
        inputElement.value = maxValue;
        inputElement.setAttribute('title', `Value adjusted to the maximum allowed: ${maxValue}`);

        tooltipInstance.show();

        // Clears any existing timeout to prevent unwanted tooltip disposal.
        if (inputElement.tooltipTimeout) {
            clearTimeout(inputElement.tooltipTimeout);
        }

        // Sets a new timeout to dispose of the tooltip,
        inputElement.tooltipTimeout = setTimeout(() => {
            if (tooltipInstance) {
                tooltipInstance.dispose();
                tooltipInstance = null;
            }
            inputElement.setAttribute('title', '');
        }, 2000);

    } else {
        // Disposess of any existing tooltip and clear the title if the value is within the limit.
        if (tooltipInstance) {
            clearTimeout(inputElement.tooltipTimeout);
            tooltipInstance.dispose();
            tooltipInstance = null;
            inputElement.setAttribute('title', '');
        }
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
 * calls the `updateHostInputLimit` function with the current CIDR value and 
 * sets up an event listener for changes to the CIDR selection. If the CIDR 
 * dropdown is not found, it logs a message to the console.
 * 
 * @param {HTMLElement} cidrSelect - The CIDR dropdown element.
 */
function initializeCidrSelection() {
    if (cidrSelect) {
        // Calls the updateHostInputLimit function with the current CIDR value.
        updateHostInputLimit(cidrSelect.value);

        // Sets up the change event listener for the CIDR selection.
        cidrSelect.addEventListener('change', function () {
            updateHostInputLimit(this.value);
        });
    } else {
        // Log to console that no CIDR elements were found.
        console.log('CIDR select element not found on this page.');
    }
}

// BUSINESS LOGIC --------------------------
/**
 * Calculates the wildcard mask for a given subnet mask.
 * 
 * This method splits the subnet mask into octets, subtracts each from 255 to get the
 * wildcard values, and then joins them back into a dotted decimal string.
 * 
 * @param {string} subnetMask - The subnet mask in dotted decimal format.
 * @return {string} The calculated wildcard mask in dotted decimal format.
 */
function calculateWildcardMask(subnetMask) {
    const maskOctets = subnetMask.split('.');
    const wildcardOctets = maskOctets.map(octet => 255 - parseInt(octet));
    const wildcardMask = wildcardOctets.join('.');

    return wildcardMask
}