/*global chrome*/

import React from 'react';
import { Container, Image, Button } from 'react-bootstrap';

let clickSettings = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

let clickAutofill = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (!currentTab.url?.includes('chrome://')) {
      if (currentTab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          files: ["autofill.js"]
        });
      }
    }

  });
}

function EasyAppPopup() {
  return (
    <Container className="text-center m-1">
      <Image src="icons/easyAppDark.svg" alt="EasyApp Logo" id="logo" className="mx-auto d-block w-75" />
      <Button variant="primary" className="w-100 mb-3" id="autofill" onClick={clickAutofill}>Autofill Page</Button>
      <Button variant="primary" className="w-100 mb-3">Navigate Listings</Button>
      <Button variant="secondary" className="w-100 mb-3" id="settings" onClick={clickSettings}>Settings</Button>
    </Container>
  );
}

export default EasyAppPopup;
