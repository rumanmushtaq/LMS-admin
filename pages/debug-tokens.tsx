import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/authStore';
import { Button, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';

export default function DebugTokens() {
  const router = useRouter();
  const [cookies, setCookies] = useState<Record<string, any>>({});
  const auth = useAuthStore();

  useEffect(() => {
    // Get all cookies
    const allCookies = Cookies.get();
    setCookies(allCookies);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Text h1>Debug - Token Storage</Text>
      
      <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <Text h3>Zustand Store State</Text>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px' }}>
          {JSON.stringify({
            isAuthenticated: auth.isAuthenticated,
            user: auth.user,
            accessToken: auth.accessToken ? '***' + auth.accessToken?.slice(-10) : null,
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <Text h3>All Cookies</Text>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px' }}>
          {JSON.stringify(cookies, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <Text h3>Specific Auth Cookies</Text>
        <div style={{ marginTop: '10px' }}>
          <Text b>access_token:</Text>
          <Text>{Cookies.get('access_token') ? '***' + Cookies.get('access_token')!.slice(-10) : 'NOT FOUND'}</Text>
          
          <Text b style={{ marginTop: '10px', display: 'block' }}>refresh_token:</Text>
          <Text>{Cookies.get('refresh_token') ? '***' + Cookies.get('refresh_token')!.slice(-10) : 'NOT FOUND'}</Text>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button 
          onClick={() => router.push('/students')}
          color="primary"
        >
          Go to Students Page
        </Button>
        
        <Button 
          onClick={() => router.push('/')}
          color="success"
        >
          Go to Dashboard
        </Button>
        
        <Button 
          onClick={() => {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            window.location.reload();
          }}
          color="error"
        >
          Clear Tokens & Reload
        </Button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
        <Text b>Tips:</Text>
        <ul>
          <li>If tokens show {"\"NOT FOUND\""}, you need to login again</li>
          <li>If isAuthenticated is false but cookies exist, try clearing tokens and logging in again</li>
          <li>Check browser console for any API errors</li>
          <li>The middleware checks for access_token OR refresh_token cookies</li>
        </ul>
      </div>
    </div>
  );
}
