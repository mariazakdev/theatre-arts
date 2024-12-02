export function detectInAppBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    const inAppBrowsers = [
      { name: "Facebook", patterns: ["FBAN", "FBAV", "FB_IAB", "FBSV", "FBSS"] },
      { name: "Instagram", patterns: ["Instagram"] },
      { name: "Twitter", patterns: ["Twitter"] },
      { name: "WhatsApp", patterns: ["WhatsApp"] },
      { name: "LINE", patterns: ["Line"] },
      { name: "Snapchat", patterns: ["Snapchat"] },
      { name: "LinkedIn", patterns: ["LinkedIn"] },
    ];
  
    for (const browser of inAppBrowsers) {
      for (const pattern of browser.patterns) {
        if (userAgent.includes(pattern)) {
          return browser.name;
        }
      }
    }
  
    return false;
  }
  
  export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  