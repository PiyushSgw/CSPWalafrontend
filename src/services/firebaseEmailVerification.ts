import api from '@/utils/axios';

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Send a custom email verification OTP via the backend (Nodemailer).
 */
export async function sendEmailVerification(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalisedEmail = email.toLowerCase().trim();
  try {
    const res = await api.post('/auth/send-email-verification', { email: normalisedEmail });
    return {
      success: true,
      message: res.data?.message || 'OTP sent to your email. Please check your inbox.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to send verification email. Please try again.',
    };
  }
}

/**
 * Verify email OTP (called from the registration form).
 */
export async function verifyEmailOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; email?: string; message: string }> {
  try {
    const res = await api.post('/auth/verify-email', { email, otp });
    return {
      success: true,
      email: res.data?.data?.email,
      message: res.data?.message || 'Email verified successfully.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to verify email. Please try again.',
    };
  }
}

/**
 * Check if an email is already verified (has a verified record in the DB).
 */
export async function checkEmailVerificationStatus(
  email: string
): Promise<{ success: boolean; verified: boolean }> {
  try {
    const res = await api.post('/auth/check-email-verification-status', { email: email.toLowerCase().trim() });
    return {
      success: true,
      verified: res.data?.data?.verified || false,
    };
  } catch {
    return { success: false, verified: false };
  }
}
