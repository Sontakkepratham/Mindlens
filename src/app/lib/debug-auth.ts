/**
 * Debug utilities for authentication troubleshooting
 * Call these functions from browser console
 */

/**
 * Check current authentication status
 * Usage: window.debugAuth()
 */
export function debugAuth() {
  const userId = localStorage.getItem('mindlens_user_id');
  const accessToken = localStorage.getItem('mindlens_access_token');
  const email = localStorage.getItem('mindlens_user_email');

  console.log('=== MindLens Authentication Debug ===');
  console.log('User ID:', userId);
  console.log('Email:', email);
  console.log('Access Token:', accessToken);
  console.log('Token Length:', accessToken?.length);
  console.log('Token Start:', accessToken?.substring(0, 50) + '...');
  console.log('Is Auto-Signin (OLD BUG):', accessToken === 'auto-signin');
  console.log('Is Pending (OLD BUG):', accessToken === 'pending');
  console.log('Token Looks Valid:', accessToken && accessToken.length > 100);
  console.log('=====================================');

  if (accessToken === 'auto-signin' || accessToken === 'pending') {
    console.error('❌ ERROR: You have an invalid token from an old bug!');
    console.warn('🔧 FIX: Run window.clearAuth() and sign in again');
  } else if (!accessToken) {
    console.warn('⚠️  No authentication token found');
    console.warn('💡 Please sign in to use the app');
  } else if (accessToken.length < 100) {
    console.warn('⚠️  Token appears invalid (too short)');
    console.warn('🔧 FIX: Run window.clearAuth() and sign in again');
  } else {
    console.log('✅ Authentication looks good!');
  }

  return {
    userId,
    email,
    accessToken,
    isValid: accessToken !== 'auto-signin' && accessToken !== 'pending' && !!accessToken && accessToken.length > 100,
  };
}

/**
 * Clear authentication data
 * Usage: window.clearAuth()
 */
export function clearAuth() {
  console.log('🧹 Clearing authentication data...');
  localStorage.removeItem('mindlens_user_id');
  localStorage.removeItem('mindlens_access_token');
  localStorage.removeItem('mindlens_user_email');
  console.log('✅ Authentication cleared! Please sign in again.');
  console.log('💡 Reload the page to return to sign in screen.');
  
  // Auto reload after 2 seconds
  setTimeout(() => {
    console.log('🔄 Reloading page...');
    window.location.reload();
  }, 2000);
}

// Make functions available globally in development
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
  (window as any).clearAuth = clearAuth;
  
  // Log instructions on page load
  console.log('🔧 MindLens Debug Tools Available:');
  console.log('  - window.debugAuth() - Check authentication status');
  console.log('  - window.clearAuth() - Clear session and reload');
}