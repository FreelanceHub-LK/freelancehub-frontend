import apiClient from "../../api/axios-instance";

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface PasskeyRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
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
    requireResidentKey: boolean;
  };
  timeout: number;
  attestation: "none" | "indirect" | "direct";
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
    const response = await apiClient.post('/auth/passkeys/register/initiate', { deviceName });
    return response.data as PasskeyRegistrationOptions;
  },

  // Complete passkey registration
  completeRegistration: async (credential: PasskeyRegistrationCredential, deviceName: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/passkeys/register/complete', {
      credential,
      deviceName,
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
  // Convert array buffer to base64
  arrayBufferToBase64: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  // Convert base64 to array buffer
  base64ToArrayBuffer: (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },

  // Check if WebAuthn is supported
  isWebAuthnSupported: (): boolean => {
    return !!(navigator.credentials && navigator.credentials.create);
  },

  // Create passkey credential
  createCredential: async (options: PasskeyRegistrationOptions): Promise<PasskeyRegistrationCredential> => {
    if (!webAuthnUtils.isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    // Convert options to the format expected by WebAuthn
    const credentialCreationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge: webAuthnUtils.base64ToArrayBuffer(options.challenge),
        rp: options.rp,
        user: {
          id: new TextEncoder().encode(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: options.pubKeyCredParams as PublicKeyCredentialParameters[],
        authenticatorSelection: options.authenticatorSelection as AuthenticatorSelectionCriteria,
        timeout: options.timeout,
        attestation: options.attestation as AttestationConveyancePreference,
      },
    };

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
