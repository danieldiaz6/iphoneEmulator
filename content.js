// Utility function to create and dispatch touch events
function createTouchEvent(type, originalEvent, target) {
  const touch = new Touch({
    identifier: Date.now(),
    target: target,
    clientX: originalEvent.clientX,
    clientY: originalEvent.clientY,
    pageX: originalEvent.pageX,
    pageY: originalEvent.pageY,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 0,
    force: 1
  });

  return new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch]
  });
}

function createIphoneFrame() {
  // Remove existing frame if any
  const existingFrame = document.getElementById('iphone14-container');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create main container
  const container = document.createElement('div');
  container.id = 'iphone14-container';
  
  // Create iPhone frame
  const frame = document.createElement('div');
  frame.id = 'iphone14-frame';
  
  // Create notch
  const notch = document.createElement('div');
  notch.id = 'iphone14-notch';
  
  // Create status bar
  const statusBar = document.createElement('div');
  statusBar.id = 'iphone14-status-bar';
  
  // Create content wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'iphone14-content';
  
  // Create iframe for content
  const iframe = document.createElement('iframe');
  iframe.id = 'iphone14-iframe';
  iframe.src = window.location.href;
  
  // Assemble the components
  wrapper.appendChild(iframe);
  frame.appendChild(statusBar);
  frame.appendChild(notch);
  frame.appendChild(wrapper);
  container.appendChild(frame);
  
  // Add to page
  document.body.appendChild(container);
  
  return iframe;
}

function injectMobileMetaTag(doc) {
  let viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = doc.createElement('meta');
    viewport.name = 'viewport';
    doc.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no';
}

function applyIphoneEmulation() {
  // Store original body
  const originalBody = document.body.cloneNode(true);
  
  // Clear and prepare body
  document.body.innerHTML = '';
  document.body.classList.add('iphone-emulation');
  
  // Create iPhone frame and get iframe reference
  const iframe = createIphoneFrame();
  
  // Wait for iframe to load
  iframe.addEventListener('load', () => {
    const iframeDoc = iframe.contentDocument;
    const iframeWin = iframe.contentWindow;
    
    // Inject viewport meta tag
    injectMobileMetaTag(iframeDoc);
    
    // Override user agent
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
    Object.defineProperty(iframeWin.navigator, 'userAgent', {
      get: function() { return mobileUserAgent; }
    });
    
    // Set mobile properties
    Object.defineProperties(iframeWin, {
      innerWidth: { value: 390, configurable: true },
      innerHeight: { value: 844, configurable: true },
      outerWidth: { value: 390, configurable: true },
      outerHeight: { value: 844, configurable: true }
    });
    
    // Forward touch events
    const content = iframe.contentDocument.body;
    content.addEventListener('click', (e) => {
      const touchstart = createTouchEvent('touchstart', e, e.target);
      const touchend = createTouchEvent('touchend', e, e.target);
      e.target.dispatchEvent(touchstart);
      e.target.dispatchEvent(touchend);
    });
    
    // Trigger resize event
    iframeWin.dispatchEvent(new Event('resize'));
  });
}

// Export the function to be called by the background script
window.applyIphoneEmulation = applyIphoneEmulation;