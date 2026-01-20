// Authentication service for VitaVoice

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    bloodType: string;
    phoneNumber: string;
    emergencyContact?: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    createdAt: Date;
}

export interface SignupData extends UserCredentials {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    bloodType: string;
    phoneNumber: string;
    emergencyContact?: string;
    allergies?: string[];
    chronicConditions?: string[];
}

class AuthService {
    private readonly USERS_KEY = 'vitavoice_users';
    private readonly CURRENT_USER_KEY = 'vitavoice_current_user';
    private readonly SESSION_KEY = 'vitavoice_session';

    /**
     * Sign up a new user
     */
    async signup(data: SignupData): Promise<{ success: boolean; error?: string }> {
        try {
            // Check if user already exists
            const existingUser = this.getUserByEmail(data.email);
            if (existingUser) {
                return { success: false, error: 'Email already registered' };
            }

            // Create user profile
            const userProfile: UserProfile = {
                id: Date.now().toString(),
                email: data.email,
                name: data.name,
                age: data.age,
                gender: data.gender,
                bloodType: data.bloodType,
                phoneNumber: data.phoneNumber,
                emergencyContact: data.emergencyContact,
                allergies: data.allergies || [],
                chronicConditions: data.chronicConditions || [],
                medications: [],
                createdAt: new Date(),
            };

            // Store credentials (encrypted password)
            const hashedPassword = await this.hashPassword(data.password);

            // Save user
            const users = this.getAllUsers();
            users.push({
                profile: userProfile,
                passwordHash: hashedPassword,
            });

            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

            // Auto-login after signup
            this.createSession(userProfile);

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Signup failed. Please try again.' };
        }
    }

    /**
     * Login user
     */
    async login(credentials: UserCredentials): Promise<{ success: boolean; error?: string }> {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.profile.email === credentials.email);

            if (!user) {
                return { success: false, error: 'Invalid email or password' };
            }

            // Verify password
            const isValid = await this.verifyPassword(credentials.password, user.passwordHash);
            if (!isValid) {
                return { success: false, error: 'Invalid email or password' };
            }

            // Create session
            this.createSession(user.profile);

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    /**
     * Check if user is logged in
     */
    isAuthenticated(): boolean {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            const expiryTime = new Date(sessionData.expiresAt).getTime();
            const now = new Date().getTime();

            if (now > expiryTime) {
                this.logout();
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get current user profile
     */
    getCurrentUser(): UserProfile | null {
        if (!this.isAuthenticated()) return null;

        const userData = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!userData) return null;

        try {
            return JSON.parse(userData, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
            });
        } catch {
            return null;
        }
    }

    /**
     * Update user profile
     */
    updateProfile(updates: Partial<UserProfile>): boolean {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const updatedUser = { ...currentUser, ...updates };

        // Update in users list
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.profile.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].profile = updatedUser;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
            return true;
        }

        return false;
    }

    /**
     * Hash password (simple implementation - use bcrypt in production)
     */
    private async hashPassword(password: string): Promise<string> {
        // Simple hash for demo - use proper bcrypt in production
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'vitavoice_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Verify password
     */
    private async verifyPassword(password: string, hash: string): Promise<boolean> {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    }

    /**
     * Create user session
     */
    private createSession(user: UserProfile): void {
        const session = {
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    /**
     * Get all users (internal)
     */
    private getAllUsers(): Array<{ profile: UserProfile; passwordHash: string }> {
        const data = localStorage.getItem(this.USERS_KEY);
        if (!data) return [];

        try {
            return JSON.parse(data, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
            });
        } catch {
            return [];
        }
    }

    /**
     * Get user by email (internal)
     */
    private getUserByEmail(email: string): UserProfile | null {
        const users = this.getAllUsers();
        const user = users.find(u => u.profile.email === email);
        return user ? user.profile : null;
    }

    /**
     * Change password
     */
    async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const users = this.getAllUsers();
        const user = users.find(u => u.profile.id === currentUser.id);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Verify old password
        const isValid = await this.verifyPassword(oldPassword, user.passwordHash);
        if (!isValid) {
            return { success: false, error: 'Current password is incorrect' };
        }

        // Update password
        user.passwordHash = await this.hashPassword(newPassword);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return { success: true };
    }
}

export const authService = new AuthService();
