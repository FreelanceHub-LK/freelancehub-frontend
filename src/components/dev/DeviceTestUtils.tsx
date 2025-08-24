// Test utilities for device detection and passkey functionality
"use client";

import { deviceUtils } from '@/lib/utils/device';
import { webAuthnUtils } from '@/lib/api/registration';

export function DeviceTestUtils() {
  const testDeviceDetection = () => {
    const deviceInfo = deviceUtils.getDeviceInfo();
    console.log('Device Detection Test:', {
      deviceName: deviceInfo.name,
      shortName: deviceUtils.getShortDeviceName(),
      type: deviceInfo.type,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      webAuthnSupported: webAuthnUtils.isWebAuthnSupported()
    });
  };

  const testBase64Conversion = () => {
    try {
      // Test with some sample data
      const testData = new Uint8Array([1, 2, 3, 4, 5]);
      const base64 = webAuthnUtils.arrayBufferToBase64(testData.buffer);
      const converted = webAuthnUtils.base64ToArrayBuffer(base64);
      const convertedArray = new Uint8Array(converted);
      
      console.log('Base64 Conversion Test:', {
        original: Array.from(testData),
        base64: base64,
        converted: Array.from(convertedArray),
        success: testData.every((val, i) => val === convertedArray[i])
      });
    } catch (error) {
      console.error('Base64 conversion test failed:', error);
    }
  };

  const testInvalidBase64 = () => {
    try {
      // Test with invalid base64
      webAuthnUtils.base64ToArrayBuffer('invalid@base64!');
      console.log('Invalid base64 test: Should have thrown an error');
    } catch (error) {
      console.log('Invalid base64 test: Correctly caught error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Device & Passkey Test Utils</h3>
      <div className="space-x-2">
        <button 
          onClick={testDeviceDetection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Device Detection
        </button>
        <button 
          onClick={testBase64Conversion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Base64 Conversion
        </button>
        <button 
          onClick={testInvalidBase64}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Invalid Base64
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Check browser console for test results
      </div>
    </div>
  );
}

export default DeviceTestUtils;
