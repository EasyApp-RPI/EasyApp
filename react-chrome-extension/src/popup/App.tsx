// This app is the popup window that has buttons for the user to triger actions, and links to the options page

import React from 'react';
import { Container, Image, Button } from 'react-bootstrap';

let clickSettings = () => {
  // We need to use the chrome api to open the settings page, https://developer.chrome.com/docs/extensions/reference/
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
};

let clickAutofill = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Since we are currently running JS in the popup window, if we want to run code on the web page itself
    // we need to inject another js file into the page.
    if (!currentTab.url?.includes('chrome://')) {
      if (currentTab?.id) {
        chrome.scripting.executeScript({
          target: { allFrames: true, tabId: currentTab.id },
          // This file is generated by webpack, but is created from the autofill/autofillScript.ts file
          files: ['autofill.js'],
        });
      }
    }
  });
};

function EasyAppPopup() {
  return (
    <Container className='text-center m-1'>
      <Image
        src='icons/easyAppDark.svg'
        alt='EasyApp Logo'
        id='logo'
        className='mx-auto d-block w-75'
      />
      <Button
        variant='primary'
        className='w-100 mb-3'
        id='autofill'
        onClick={clickAutofill}>
        Autofill Page
      </Button>
      <Button variant='primary' className='w-100 mb-3'>
        Navigate Listings
      </Button>
      <Button
        variant='secondary'
        className='w-100 mb-3'
        id='settings'
        onClick={clickSettings}>
        Settings
      </Button>
    </Container>
  );
}

export default EasyAppPopup;
