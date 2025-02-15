// src/service-worker.js (continue from previous code)

//save settings on local storage
const settings = {
  enabled: true,
  disabledSites: [],
  adsLimit: 4,
  colorThemes: 'purplish',
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ settings });
  const dynamicRules = [];
  if (dynamicRules && dynamicRules.length > 0) {
    try {
      // Clear existing rules and add new ones if EasyList was loaded successfully
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dynamicRules.map((rule) => rule.id), // Correct property: removeRuleIds
        addRules: dynamicRules,
      });
      console.log(`Successfully added ${dynamicRules.length} EasyList rules.`);
      // Optionally, fetch feedback rules if you want to track rule matching (more advanced)
      // chrome.declarativeNetRequest.getRuleFeedback().then(feedback => console.log("Rule Feedback:", feedback));
    } catch (error) {
      console.error('Error updating dynamic rules:', error);
    }
  } else {
    console.warn('No rules loaded from EasyList or error during loading.');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log(`Tab updated: ${tab.url}`);
  }
});

// src/service-worker.js

async function loadAndConvertEasyList() {
  try {
    const maxRulesToLoad = 4000; // Set your limit here
    let rulesLoadedCount = 0;

    const response = await fetch('/easylist.txt'); // Fetch from the root of the build (public folder content)
    if (!response.ok) {
      console.error(
        'Failed to fetch EasyList:',
        response.status,
        response.statusText
      );
      return [];
    }
    const text = await response.text();
    const lines = text.split('\n');
    const rules = [];
    let ruleIdCounter = 1; // Unique IDs for rules are required

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip comments and empty lines
      if (trimmedLine.startsWith('!') || trimmedLine === '') {
        continue;
      }

      let rule = null;
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('||')) {
        const filterRule = trimmedLine.startsWith('-')
          ? trimmedLine.substring(1)
          : trimmedLine.substring(2); // Remove leading - or ||

        // Basic rule parsing - you'll need to expand this for more complex rules
        let urlFilter = filterRule.split('$')[0]; // Basic URL filter part
        let optionsPart = filterRule.split('$')[1] || ''; // Options part (like domain, resource type)
        let resourceTypes = [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'media',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'websocket',
          'other',
        ]; // Block all by default unless whitelisted

        let domainFilter = null;
        let excludedDomains = null;

        if (optionsPart) {
          const options = optionsPart.split(',');
          for (const option of options) {
            if (option.startsWith('domain=')) {
              const domains = option.substring(7).split('|'); // e.g., domain=example.com,~blocked.com
              domainFilter = [];
              excludedDomains = [];
              for (const domain of domains) {
                if (domain.startsWith('~')) {
                  excludedDomains.push(domain.substring(1));
                } else {
                  domainFilter.push(domain);
                }
              }
            } else if (option.startsWith('~')) {
              // Exclude resource types (e.g., ~image)
              const excludedType = option.substring(1);
              resourceTypes = resourceTypes.filter(
                (type) => type !== excludedType
              );
            } else if (resourceTypes.includes(option)) {
              // Include specific resource types (e.g., image)
              resourceTypes = [option]; // If specific type included, only block that type
            }
          }
        }

        rule = {
          id: ruleIdCounter++,
          priority: 1, // Adjust priority as needed
          action: { type: 'block' },
          condition: {
            urlFilter: urlFilter + '*', // Basic wildcard matching - adjust as needed for EasyList syntax
            resourceTypes: resourceTypes,
          },
        };
        if (domainFilter && domainFilter.length > 0) {
          rule.condition.domains = domainFilter;
        }
        if (excludedDomains && excludedDomains.length > 0) {
          rule.condition.domains = excludedDomains;
        }
      }

      if (rule) {
        if (rulesLoadedCount < maxRulesToLoad) {
          // Check the limit
          rules.push(rule);
          rulesLoadedCount++;
        } else {
          console.warn(
            `EasyList rule limit of ${maxRulesToLoad} reached.  Stopping rule loading.`
          );
          break; // Stop loading more rules
        }
      }
    }
    return rules;
  } catch (error) {
    console.error('Error loading or parsing EasyList:', error);
    return [];
  }
}
