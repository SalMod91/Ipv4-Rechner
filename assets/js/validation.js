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
        showError(inputElement, `Wert auf das maximal zulässige angepasst: ${maxValue}`);
    } else if (currentValue <= 0) {
        inputElement.value = 1;
        showError(inputElement, `Der Wert kann nicht kleiner als 1 sein. Er wurde automatisch auf 1 gesetzt.`);
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
        showError(ipAddress, "Ungültige IP-Adresse.");
        return false;
    }

    // Validates CIDR.
    // .trim() removes any leading or trailing whitespace from the CIDR selection input.
    let cidrValue = cidrSelect.value.trim();
    let cidrNumber = parseInt(cidrValue.replace('/', ''));
    if (isNaN(cidrNumber) || !validateCidr(cidrValue)) {
        showError(cidrSelect, "Ungültiger CIDR.");
        return false;
    }

    // Validates Subnets if provided.
    let subnetsValue = subnetsInput.value.trim();
    if (!validateSubnets(cidrNumber, subnetsValue)) {
        showError(subnetsInput, "Ungültiger Subnetz-Wert.");
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