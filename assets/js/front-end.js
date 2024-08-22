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
const calculateButton = document.getElementById('calculateButton')


// Event Listeners
if (cidrSelect) {
    cidrSelect.addEventListener('change', function() {
        cidrChange(this.value);
    });
};
if (subnetsInput) {
    subnetsInput.addEventListener('input', handleSubnetInputChange);
};
if (calculateButton) {
    calculateButton.addEventListener('click', function() {
        if (validateInputs()) {
            let ipAddressValue = ipAddress.value.trim();
            let cidrValue = parseInt(cidrSelect.value.replace('/', ''));
            let hostsValue = parseInt(hostsInput.value.trim());
            let subnetsValue = parseInt(subnetsInput.value.trim());

            let results = calculateNetworkDetails(ipAddressValue, cidrValue, hostsValue, subnetsValue);
            displayResults(results);

            resultsContainer.style.display = 'block';
        }
    });
};


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
        subnetResultsContainer.style.display = 'block'; // Show the container if there are results
        results.subnets.forEach((subnet, index) => {
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
    } else {
        subnetResultsContainer.style.display = 'none'; // Hide the container if there are no results
    }

        // Displays warning if the maximum limit of subnets is reached.
        let maxSubnetsToShow = 256;
        if (results.subnets.length === maxSubnetsToShow) {
            let warningMessage = document.createElement('p');
            warningMessage.classList.add('text-warning');
            warningMessage.textContent = `Es werden die ersten ${maxSubnetsToShow} Subnetze angezeigt. Bitte grenzen Sie Ihre Eingabe ein, um detailliertere Ergebnisse zu erhalten.`;
            document.getElementById('subnetResultsContainer').appendChild(warningMessage);
        }
}

// Temporary alert message to debug code.
function showError(inputElement, message) {
    const tooltipInstance = bootstrap.Tooltip.getInstance(inputElement);

    if (tooltipInstance) {
        tooltipInstance.dispose();
    }

    const newTooltipInstance = new bootstrap.Tooltip(inputElement, {
        title: message,
        trigger: 'manual',
        placement: 'right'
    });

    newTooltipInstance.show();

    setTimeout(() => {
        newTooltipInstance.hide();
    }, 2000);
}