import {
  updateEmail,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Firebase Email Verification Service
 *
 * Handles sending verification emails, setting email on existing users,
 * creating new Firebase users if needed, and checking verification status.
 */

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Send email verification to the currently signed-in Firebase user.
 * Sets the email on the current user (updateEmail) then sends the
 * verification link via sendEmailVerification.
 *
 * Handles the common auth/requires-recent-login error by skipping
 * updateEmail when the email is already set.
 */
export async function sendEmailVerificationToCurrentUser(
  email: string
): Promise<{ success: boolean; message: string }> {
  const user = auth.currentUser;

  if (!user) {
    return {
      success: false,
      message: 'No authenticated user. Please verify your mobile number first.',
    };
  }

  try {
    // Only call updateEmail if the email is actually different
    // This avoids auth/requires-recent-login errors when the email is already correct
    if (user.email !== email) {
      try {
        await updateEmail(user, email);
      } catch (updateErr: any) {
        // If requires-recent-login, check if email is already set (might be a stale token issue)
        if (updateErr.code === 'auth/requires-recent-login') {
          // Reload user to check if email was already set
          await user.reload();
          if (user.email === email) {
            // Email is already correct, just send verification
          } else {
            return {
              success: false,
              message: 'Session expired. Please verify your mobile number again and try.',
            };
          }
        } else {
          return {
            success: false,
            message: getFirebaseEmailError(updateErr),
          };
        }
      }
    }

    // Send the verification email
    await sendEmailVerification(user);

    return {
      success: true,
      message:
        'Verification email has been sent successfully. Please check your inbox and click the verification link.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: getFirebaseEmailError(error),
    };
  }
}

/**
 * Create a new Firebase user with email + temporary password,
 * then send verification email. Used when no user is signed in.
 */
export async function createFirebaseUserAndSendVerification(
  email: string
): Promise<{ success: boolean; message: string; user?: User }> {
  // Generate a strong temporary password (user will register with their own password via backend)
  const tempPassword = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      tempPassword
    );

    await sendEmailVerification(credential.user);

    return {
      success: true,
      message:
        'Verification email has been sent successfully. Please check your inbox and click the verification link.',
      user: credential.user,
    };
  } catch (error: any) {
    // If user already exists, try to sign in and send verification
    if (error.code === 'auth/email-already-in-use') {
      return await signInAndSendVerification(email, tempPassword);
    }
    return {
      success: false,
      message: getFirebaseEmailError(error),
    };
  }
}

/**
 * Attempt sign-in to check if the email belongs to an existing user,
 * then send verification. Used as fallback when createUser fails.
 */
async function signInAndSendVerification(
  email: string,
  tempPassword: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Try sign-in to verify the account exists
    const credential = await signInWithEmailAndPassword(auth, email, tempPassword);
    await sendEmailVerification(credential.user);
    return {
      success: true,
      message:
        'Verification email has been sent successfully. Please check your inbox and click the verification link.',
      user: credential.user,
    };
  } catch {
    return {
      success: false,
      message:
        'This email is already associated with another account. Please use a different email address.',
    };
  }
}

/**
 * Reload the Firebase user and check if email is verified.
 * Returns the updated emailVerified status.
 */
export async function checkEmailVerified(
  user: User | null
): Promise<boolean> {
  if (!user) return false;
  try {
    await user.reload();
    return user.emailVerified === true;
  } catch {
    return false;
  }
}

/**
 * Map Firebase Auth error codes to user-friendly messages.
 */
export function getFirebaseEmailError(error: any): string {
  const code = error?.code as string | undefined;

  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/email-already-in-use':
      return 'This email is already registered with another account. Please use a different email.';
    case 'auth/user-not-found':
      return 'No account found. Please verify your mobile number first.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/operation-not-allowed':
      return 'Email verification is not enabled. Contact support.';
    case 'auth/requires-recent-login':
      return 'Session expired. Please verify your mobile number again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check and try again.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
}
