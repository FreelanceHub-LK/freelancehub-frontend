// Device detection utilities
export interface DeviceInfo {
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
}

export const deviceUtils = {
  // Get browser name
  getBrowserName: (): string => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown Browser';
  },

  // Get operating system
  getOperatingSystem: (): string => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac') || platform.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    
    return 'Unknown OS';
  },

  // Get device type
  getDeviceType: (): 'desktop' | 'mobile' | 'tablet' => {
    const userAgent = navigator.userAgent;
    
    // Check for mobile devices
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return 'mobile';
    }
    
    // Check for tablets
    if (/iPad|Android(?=.*Tablet)|PlayBook|Kindle/i.test(userAgent)) {
      return 'tablet';
    }
    
    return 'desktop';
  },

  // Generate automatic device name
  generateDeviceName: (): string => {
    const browser = deviceUtils.getBrowserName();
    const os = deviceUtils.getOperatingSystem();
    const deviceType = deviceUtils.getDeviceType();
    
    // Create a more descriptive name
    const typeMap = {
      desktop: 'Computer',
      mobile: 'Phone',
      tablet: 'Tablet'
    };
    
    return `${typeMap[deviceType]} (${os}, ${browser})`;
  },

  // Get detailed device info
  getDeviceInfo: (): DeviceInfo => {
    return {
      name: deviceUtils.generateDeviceName(),
      type: deviceUtils.getDeviceType(),
      os: deviceUtils.getOperatingSystem(),
      browser: deviceUtils.getBrowserName()
    };
  },

  // Get a short device identifier
  getShortDeviceName: (): string => {
    const os = deviceUtils.getOperatingSystem();
    const browser = deviceUtils.getBrowserName();
    
    return `${os} ${browser}`;
  }
};
