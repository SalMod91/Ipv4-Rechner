// Waits for the DOM to be finished loading
document.addEventListener ("DOMContentLoaded", function() {
});

document.getElementById('cidrSelect').addEventListener('change', function() {
    updateHostInputLimit(this.value);
});

// DOM Variables
const ipAddress = document.getElementById('ipAddress')
const cidrSelect = document.getElementById('cidrSelect');
const subnetMaskInput = document.getElementById('subnetMask');
const wildcardMaskInput = document.getElementById('wildcardMask');

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
    // Split the subnet mask into an array of octets
    const maskOctets = subnetMask.split('.');

    // Calculate the wildcard mask by subtracting each octet from 255
    const wildcardOctets = maskOctets.map(octet => 255 - parseInt(octet));

    // Join the wildcard octets back into a dotted decimal string
    const wildcardMask = wildcardOctets.join('.');

    // Update the Wildcard Mask input field with the calculated value
    wildcardMaskInput.value = wildcardMask;
}

/**
 * Updates the maximum number of hosts input limit based on the selected CIDR.
 * This function computes the maximum allowable hosts within a subnet.
 * @param {string} - The CIDR notation chosen by the User which gets parsed into an Integer.
 */
function updateHostInputLimit(cidr) {

    // Remove the slash and parse the CIDR value as an integer
    const cidrValue = parseInt(cidr.replace('/', ''));

    // Calculate how many bits are for hosts
    const hostBits = 32 - cidrValue;

    // Compute the maximum number of hosts
    const maxHosts = Math.pow(2, hostBits) - 2;
    
    // Set the maximum value for the input
    document.getElementById('requiredHosts').max = maxHosts;
    // Optional: Update placeholder to indicate max value
    document.getElementById('requiredHosts').placeholder = "Max " + maxHosts + " hosts";
}