import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export function AuthControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  
  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">
        {isAuthenticated
          ? 'Your settings and records are synced across devices.'
          : 'Sign in to sync your settings and records across devices.'}
      </p>
      <button
        onClick={handleAuth}
        disabled={disabled}
        className={`w-full rounded-lg px-6 py-3 font-semibold transition-colors ${
          isAuthenticated
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}
