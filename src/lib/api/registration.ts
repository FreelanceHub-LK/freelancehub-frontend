import apiClient from "../../api/axios-instance";

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface PasskeyRegistrationOptions {
  challenge: string | Uint8Array; // Can be either string (base64) or Uint8Array
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string | Uint8Array; // Can be either string or Uint8Array
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: "public-key";
    alg: number;
  }>;
  authenticatorSelection: {
    authenticatorAttachment?: "platform" | "cross-platform";
    userVerification: "required" | "preferred" | "discouraged";
    residentKey?: "discouraged" | "preferred" | "required";
    requireResidentKey?: boolean;
  };
  timeout: number;
  attestation: "none" | "indirect" | "direct";
  excludeCredentials?: Array<{
    id: string | Uint8Array;
    type: "public-key";
    transports?: Array<"usb" | "nfc" | "ble" | "internal">;
  }>;
}

export interface PasskeyRegistrationCredential {
  id: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
  type: string;
}

// Skills API
export const skillsApi = {
  // Get all available skills
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills');
    return response.data as Skill[];
  },

  // Get skills by category
  getSkillsByCategory: async (category: string): Promise<Skill[]> => {
    const response = await apiClient.get(`/skills/category/${category}`);
    return response.data as Skill[];
  },

  // Search skills
  searchSkills: async (query: string): Promise<Skill[]> => {
    const response = await apiClient.get(`/skills/search?q=${encodeURIComponent(query)}`);
    return response.data as Skill[];
  },

  // Add custom skill
  addSkill: async (skillData: { name: string; category?: string }): Promise<Skill> => {
    const response = await apiClient.post('/skills', skillData);
    return response.data as Skill;
  },
};

// Freelancer API
export const freelancerApi = {
  // Update freelancer skills
  updateSkills: async (skills: string[]): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch(`/freelancers/me/skills`, { skills });
    return response.data as { success: boolean; message: string };
  },

  // Get freelancer profile
  getMyProfile: async (): Promise<any> => {
    const response = await apiClient.get(`/freelancers/me`);
    return response.data;
  },

  // Update freelancer profile
  updateMyProfile: async (profileData: any): Promise<any> => {
    const response = await apiClient.patch(`/freelancers/me`, profileData);
    return response.data;
  },
};

// Passkey API
export const passkeyApi = {
  // Initiate passkey registration
  initiateRegistration: async (deviceName: string): Promise<PasskeyRegistrationOptions> => {
    try {
      console.log('Making API request to:', '/auth/passkeys/register/initiate');
      console.log('Request payload:', { deviceName });
      console.log('API base URL:', apiClient.defaults.baseURL);
      
      // Check if user is authenticated before making the request
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('You must be logged in to register a passkey');
      }
      
      const response = await apiClient.post('/auth/passkeys/register/initiate', { deviceName });
      console.log('Response received:', response.status, response.statusText);
      console.log('Response data:', response.data);
      
      const options = response.data as PasskeyRegistrationOptions;
      
      // Validate the response from the server
      if (!options) {
        throw new Error('No registration options received from server');
      }
      
      if (!options.challenge) {
        throw new Error('Server did not provide a challenge');
      }
      
      if (typeof options.challenge !== 'string') {
        throw new Error(`Invalid challenge format: expected string, got ${typeof options.challenge}`);
      }
      
      // Validate challenge is base64-like
      if (options.challenge.length === 0) {
        throw new Error('Empty challenge received from server');
      }
      
      // Log for debugging (remove in production)
      console.log('Registration options received:', {
        challengeLength: options.challenge.length,
        challengePreview: options.challenge.substring(0, 20) + '...',
        hasUser: !!options.user,
        hasRp: !!options.rp,
        userId: options.user?.id,
        rpName: options.rp?.name
      });
      
      return options;
    } catch (error: any) {
      console.error('Error initiating passkey registration:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid device name or registration parameters');
      } else if (error.response?.status === 401) {
        throw new Error('You must be logged in to register a passkey');
      } else if (error.response?.status === 409) {
        throw new Error('A passkey is already registered for this device');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error during passkey registration. Please try again.');
      }
      
      throw new Error(error.message || 'Failed to initiate passkey registration');
    }
  },

  // Complete passkey registration
  completeRegistration: async (credential: PasskeyRegistrationCredential, deviceName: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/passkeys/register/complete', {
      credential,
      deviceName,
      userAgent: navigator.userAgent, // Include user agent
    });
    return response.data as { success: boolean; message: string };
  },

  // Initiate passkey authentication
  initiateAuthentication: async (email: string): Promise<any> => {
    const response = await apiClient.post('/auth/passkeys/authenticate/initiate', { email });
    return response.data;
  },

  // Complete passkey authentication
  completeAuthentication: async (credential: any): Promise<any> => {
    const response = await apiClient.post('/auth/passkeys/authenticate/complete', { credential });
    return response.data;
  },

  // Get user's passkeys
  getUserPasskeys: async (): Promise<any[]> => {
    const response = await apiClient.get('/auth/passkeys');
    return response.data as any[];
  },

  // Delete a passkey
  deletePasskey: async (passkeyId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/auth/passkeys/${passkeyId}`);
    return response.data as { success: boolean; message: string };
  },
};

// WebAuthn utilities
export const webAuthnUtils = {
  // Helper function to convert challenge to ArrayBuffer
  challengeToArrayBuffer: (challenge: string | Uint8Array): ArrayBuffer => {
    if (challenge instanceof Uint8Array) {
      return challenge.buffer.slice(challenge.byteOffset, challenge.byteOffset + challenge.byteLength) as ArrayBuffer;
    }
    return webAuthnUtils.base64ToArrayBuffer(challenge);
  },

  // Helper function to convert user ID to BufferSource
  userIdToBufferSource: (userId: string | Uint8Array): BufferSource => {
    if (userId instanceof Uint8Array) {
      // Create a new ArrayBuffer and copy the data
      const buffer = new ArrayBuffer(userId.byteLength);
      const view = new Uint8Array(buffer);
      view.set(userId);
      return view;
    }
    return new TextEncoder().encode(userId);
  },

  // Helper function to convert excludeCredentials
  processExcludeCredentials: (excludeCredentials?: Array<{id: string | Uint8Array; type: "public-key"; transports?: Array<string>}>): Array<PublicKeyCredentialDescriptor> | undefined => {
    if (!excludeCredentials) return undefined;
    
    return excludeCredentials.map(cred => ({
      id: cred.id instanceof Uint8Array 
        ? (cred.id.buffer.slice(cred.id.byteOffset, cred.id.byteOffset + cred.id.byteLength) as ArrayBuffer)
        : webAuthnUtils.base64ToArrayBuffer(cred.id),
      type: cred.type as "public-key",
      transports: cred.transports as AuthenticatorTransport[] | undefined,
    }));
  },

  // Validate base64 string
  isValidBase64: (str: string): boolean => {
    try {
      // Basic validation
      if (!str || typeof str !== 'string') return false;
      
      // Clean the base64 string first
      let cleanBase64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (cleanBase64.length % 4) {
        cleanBase64 += '=';
      }
      
      // Check if it contains only valid base64 characters
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        return false;
      }
      
      // Test if it can be decoded and re-encoded
      const decoded = atob(cleanBase64);
      const reencoded = btoa(decoded);
      return reencoded === cleanBase64;
    } catch {
      return false;
    }
  },

  // Convert array buffer to base64
  arrayBufferToBase64: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Return URL-safe base64
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  // Convert base64 to array buffer
  base64ToArrayBuffer: (base64: string): ArrayBuffer => {
    try {
      // Validate input
      if (!base64 || typeof base64 !== 'string') {
        throw new Error('Invalid base64 input: must be a non-empty string');
      }

      // Remove any whitespace
      const cleanInput = base64.trim();
      
      if (cleanInput.length === 0) {
        throw new Error('Empty base64 string after trimming');
      }
      
      // Log the input for debugging
      console.log('Converting base64 to ArrayBuffer:', {
        inputLength: cleanInput.length,
        firstChars: cleanInput.substring(0, 10),
        lastChars: cleanInput.substring(Math.max(0, cleanInput.length - 10))
      });
      
      // Clean the base64 string - remove any URL-safe characters and padding
      let cleanBase64 = cleanInput.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if necessary
      while (cleanBase64.length % 4) {
        cleanBase64 += '=';
      }
      
      // Additional validation for common issues
      if (cleanBase64.length === 0) {
        throw new Error('Empty base64 string after cleaning');
      }
      
      // Check for valid base64 characters only
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        console.error('Invalid base64 characters found:', {
          original: base64,
          cleaned: cleanBase64,
          invalidChars: cleanBase64.match(/[^A-Za-z0-9+/=]/g)
        });
        throw new Error('Contains invalid base64 characters');
      }
      
      const binary = atob(cleanBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      console.log('Successfully converted base64 to ArrayBuffer:', {
        outputLength: bytes.buffer.byteLength
      });
      
      return bytes.buffer;
    } catch (error) {
      console.error('Error decoding base64:', {
        error: error,
        input: base64,
        inputType: typeof base64,
        inputLength: base64?.length
      });
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid character')) {
          throw new Error('Server provided malformed base64 data');
        } else if (error.message.includes('invalid base64 characters')) {
          throw new Error('Server provided data with invalid characters');
        }
      }
      
      throw new Error(`Invalid base64 string: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Check if WebAuthn is supported
  isWebAuthnSupported: (): boolean => {
    return !!(navigator.credentials && navigator.credentials.create);
  },

  // Validate registration options from server
  validateRegistrationOptions: (options: any): string[] => {
    const errors: string[] = [];
    
    if (!options) {
      errors.push('No options provided');
      return errors;
    }
    
    // Check challenge
    if (!options.challenge) {
      errors.push('Missing challenge');
    } else if (typeof options.challenge !== 'string' && !(options.challenge instanceof Uint8Array)) {
      errors.push(`Invalid challenge type: ${typeof options.challenge}`);
    } else if (typeof options.challenge === 'string' && options.challenge.length === 0) {
      errors.push('Empty challenge');
    } else if (options.challenge instanceof Uint8Array && options.challenge.length === 0) {
      errors.push('Empty challenge array');
    }
    
    // Check rp (relying party)
    if (!options.rp) {
      errors.push('Missing relying party (rp) information');
    } else {
      if (!options.rp.name) errors.push('Missing rp.name');
      if (!options.rp.id) errors.push('Missing rp.id');
    }
    
    // Check user
    if (!options.user) {
      errors.push('Missing user information');
    } else {
      if (!options.user.id) errors.push('Missing user.id');
      if (!options.user.name) errors.push('Missing user.name');
      if (!options.user.displayName) errors.push('Missing user.displayName');
    }
    
    // Check pubKeyCredParams
    if (!options.pubKeyCredParams || !Array.isArray(options.pubKeyCredParams)) {
      errors.push('Missing or invalid pubKeyCredParams');
    } else if (options.pubKeyCredParams.length === 0) {
      errors.push('Empty pubKeyCredParams array');
    }
    
    // Check authenticatorSelection
    if (!options.authenticatorSelection) {
      errors.push('Missing authenticatorSelection');
    }
    
    // Check timeout
    if (options.timeout && (typeof options.timeout !== 'number' || options.timeout <= 0)) {
      errors.push('Invalid timeout value');
    }
    
    return errors;
  },

  // Create passkey credential
  createCredential: async (options: PasskeyRegistrationOptions): Promise<PasskeyRegistrationCredential> => {
    if (!webAuthnUtils.isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    try {
      // Validate and log the incoming options for debugging
      console.log('Passkey registration options received:', options);
      
      // Validate the options structure
      const validationErrors = webAuthnUtils.validateRegistrationOptions(options);
      if (validationErrors.length > 0) {
        console.error('Registration options validation failed:', validationErrors);
        throw new Error(`Invalid server data: ${validationErrors.join(', ')}`);
      }
      
      console.log('Converting challenge:', {
        challenge: options.challenge instanceof Uint8Array ? '[Uint8Array]' : options.challenge,
        challengeType: options.challenge instanceof Uint8Array ? 'Uint8Array' : typeof options.challenge,
        challengeLength: options.challenge instanceof Uint8Array ? options.challenge.length : options.challenge.length,
      });
      
      // Convert options to the format expected by WebAuthn
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge: webAuthnUtils.challengeToArrayBuffer(options.challenge),
          rp: options.rp,
          user: {
            id: webAuthnUtils.userIdToBufferSource(options.user.id),
            name: options.user.name,
            displayName: options.user.displayName,
          },
          pubKeyCredParams: options.pubKeyCredParams as PublicKeyCredentialParameters[],
          authenticatorSelection: options.authenticatorSelection as AuthenticatorSelectionCriteria,
          timeout: options.timeout,
          attestation: options.attestation as AttestationConveyancePreference,
          excludeCredentials: webAuthnUtils.processExcludeCredentials(options.excludeCredentials),
        },
      };

      console.log('WebAuthn credential creation options prepared successfully');

      const credential = await navigator.credentials.create(credentialCreationOptions) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      return {
        id: credential.id,
        rawId: webAuthnUtils.arrayBufferToBase64(credential.rawId),
        response: {
          attestationObject: webAuthnUtils.arrayBufferToBase64(response.attestationObject),
          clientDataJSON: webAuthnUtils.arrayBufferToBase64(response.clientDataJSON),
        },
        type: credential.type,
      };
    } catch (error: any) {
      console.error('WebAuthn credential creation error:', error);
      
      // Log the original options for debugging
      console.error('Original options that caused the error:', options);
      
      // Provide more user-friendly error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Passkey creation was cancelled or not allowed');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('A passkey is already registered for this account on this device');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('This device does not support the required passkey features');
      } else if (error.name === 'SecurityError') {
        throw new Error('Passkey creation failed due to security restrictions');
      } else if (error.message?.includes('base64') || error.message?.includes('Invalid base64')) {
        throw new Error('Server provided invalid challenge data. Please contact support.');
      } else if (error.message?.includes('challenge')) {
        throw new Error('Invalid challenge data from server. Please try again.');
      } else if (error.message?.includes('Invalid server data')) {
        throw new Error(error.message);
      } else if (error.message?.includes('Missing') || error.message?.includes('Invalid')) {
        throw new Error(`Server configuration error: ${error.message}`);
      }
      
      throw new Error(error.message || 'Failed to create passkey');
    }
  },

  // Get authentication credential
  getCredential: async (options: any): Promise<any> => {
    if (!webAuthnUtils.isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const credentialRequestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge: webAuthnUtils.base64ToArrayBuffer(options.challenge),
        allowCredentials: options.allowCredentials?.map((cred: any) => ({
          ...cred,
          id: webAuthnUtils.base64ToArrayBuffer(cred.id),
        })),
        timeout: options.timeout,
        userVerification: options.userVerification,
      },
    };

    const credential = await navigator.credentials.get(credentialRequestOptions) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to get credential');
    }

    const response = credential.response as AuthenticatorAssertionResponse;

    return {
      id: credential.id,
      rawId: webAuthnUtils.arrayBufferToBase64(credential.rawId),
      response: {
        authenticatorData: webAuthnUtils.arrayBufferToBase64(response.authenticatorData),
        clientDataJSON: webAuthnUtils.arrayBufferToBase64(response.clientDataJSON),
        signature: webAuthnUtils.arrayBufferToBase64(response.signature),
        userHandle: response.userHandle ? webAuthnUtils.arrayBufferToBase64(response.userHandle) : null,
      },
      type: credential.type,
    };
  },
};
