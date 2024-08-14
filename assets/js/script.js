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
const requiredHostsInput = document.getElementById('requiredHosts');

// Initialize tooltips for all elements with 'data-bs-toggle="tooltip"'.
document.addEventListener("DOMContentLoaded", function() {    
    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(function(tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Attach an event listener to the Host input field to handle user inputs.
document.getElementById('requiredHosts').addEventListener('input', function() {

    // Parse the current value of the input field into an integer.
    const currentValue = parseInt(this.value);

    // Parse the maximum value of hosts into an integer.
    const maxValue = parseInt(this.max);

    // Get the current instance of the tooltip associated with the input field.
    let tooltipInstance = bootstrap.Tooltip.getInstance(this);

    // Ensure any existing tooltip is disposed before creating a new one
    if (tooltipInstance) {
        tooltipInstance.dispose();
    }

    // Checks if the current input value exceeds the maximum allowed value
    if (currentValue > maxValue) {
        // Adjusts the current value to the maximum value
        this.value = maxValue;
        // Changes the title attribute in order to give the user a feedback through a tooltip
        this.setAttribute('title', `Value adjusted to the maximum allowed: ${maxValue}`);

        // This prevents the tooltip from auto-hiding when the input field is not hovered
        tooltipInstance = new bootstrap.Tooltip(this, {
            trigger: 'manual'
        });
        // Shows the tooltip
        tooltipInstance.show();

        // Set a timeout to automatically hide and dispose of the tooltip after 2 seconds
        setTimeout(() => {
            if (tooltipInstance) {
                // Disposes of the tooltip
                tooltipInstance.dispose();
                // Clears the title attribute
                this.setAttribute('title', '');
            }
        }, 2000); // 2 seconds countdown
    } else {
        // If the current value does not exceed the maximum value, it disposes of any leftover tooltip
        if (tooltipInstance) {
            tooltipInstance.dispose();
            this.setAttribute('title', '');
        }
    }
});

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
    
    // Gets existing tooltip instance.
    let tooltipInstance = bootstrap.Tooltip.getInstance(requiredHostsInput);

    // Checks if the current input value exceeds the new maximum value.
    if (parseInt(requiredHostsInput.value) > maxHosts) {
        // Adjusts the input value to the maximum allowed.
        requiredHostsInput.value = maxHosts;
        
        // Disposes od the old tooltip.
        if (tooltipInstance) {
        tooltipInstance.dispose();
        }

        // Updates the title attribute for the new tooltip content.
        requiredHostsInput.setAttribute('title', `Value adjusted to the maximum allowed: ${maxHosts}`);

        // Creates a new tooltip with the updated title.
        tooltipInstance = new bootstrap.Tooltip(requiredHostsInput, {
            trigger: 'manual'
        });

        // Shows the tooltip.
        tooltipInstance.show();

        // Sets a timeout to automatically hide and dispose of the tooltip after 2 seconds.
        setTimeout(() => {
            if (tooltipInstance) {
                tooltipInstance.dispose();
                requiredHostsInput.setAttribute('title', '');
            }
        }, 2000); // 2 seconds countdown
    } else {
        // If not exceeding, ensures no tooltip is displayed.
        if (tooltipInstance) {
            tooltipInstance.hide();
            tooltipInstance.dispose();
            requiredHostsInput.setAttribute('title', '');
        }
    }
}