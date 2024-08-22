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

    visualizeSubnetMask(subnetMask);
    visualizeWildcardMask(wildcardMask);
    updateInputLimits(cidrValue);
    handleSubnetInputChange();
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