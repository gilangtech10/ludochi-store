import { sdk } from '@libs/util/server/client.server';
import { setAuthToken } from '@libs/util/server/cookies.server';
import { data, redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form        = await request.formData();
  const email       = String(form.get('email') ?? '').trim();
  const password    = String(form.get('password') ?? '');
  const redirectTo  = String(form.get('redirectTo') ?? '/account');

  if (!email || !password) {
    return data({ error: 'Email dan password harus diisi.' }, { status: 400 });
  }

  try {
    const result = await sdk.auth.login('customer', 'emailpass', { email, password });

    const token = typeof result === 'string' ? result : null;
    if (!token) {
      return data({ error: 'Login gagal. Periksa kembali email dan password Anda.' }, { status: 401 });
    }

    const headers = new Headers();
    await setAuthToken(headers, token);

    return redirect(redirectTo, { headers });
  } catch {
    return data({ error: 'Email atau password salah.' }, { status: 401 });
  }
};
