// Data encryption utilities using Web Crypto API

class EncryptionService {
    private algorithm = 'AES-GCM';
    private keyLength = 256;

    /**
     * Generate encryption key
     */
    async generateKey(): Promise<CryptoKey> {
        return await crypto.subtle.generateKey(
            {
                name: this.algorithm,
                length: this.keyLength,
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Export key to store
     */
    async exportKey(key: CryptoKey): Promise<string> {
        const exported = await crypto.subtle.exportKey('jwk', key);
        return JSON.stringify(exported);
    }

    /**
     * Import key from storage
     */
    async importKey(keyData: string): Promise<CryptoKey> {
        const jwk = JSON.parse(keyData);
        return await crypto.subtle.importKey(
            'jwk',
            jwk,
            {
                name: this.algorithm,
                length: this.keyLength,
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypt data
     */
    async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedBuffer = await crypto.subtle.encrypt(
            {
                name: this.algorithm,
                iv: iv,
            },
            key,
            dataBuffer
        );

        return {
            encrypted: this.bufferToBase64(encryptedBuffer),
            iv: this.bufferToBase64(iv),
        };
    }

    /**
     * Decrypt data
     */
    async decrypt(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
        const encryptedBuffer = this.base64ToBuffer(encryptedData);
        const ivBuffer = this.base64ToBuffer(iv);

        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: this.algorithm,
                iv: ivBuffer,
            },
            key,
            encryptedBuffer
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    }

    /**
     * Hash data (for passwords, etc.)
     */
    async hash(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        return this.bufferToBase64(hashBuffer);
    }

    /**
     * Convert buffer to base64
     */
    private bufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert base64 to buffer
     */
    private base64ToBuffer(base64: string): ArrayBuffer {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Get or create encryption key for health data
     */
    async getHealthDataKey(): Promise<CryptoKey> {
        const storedKey = localStorage.getItem('vitavoice_encryption_key');

        if (storedKey) {
            return await this.importKey(storedKey);
        } else {
            const newKey = await this.generateKey();
            const exportedKey = await this.exportKey(newKey);
            localStorage.setItem('vitavoice_encryption_key', exportedKey);
            return newKey;
        }
    }
}

export const encryptionService = new EncryptionService();
