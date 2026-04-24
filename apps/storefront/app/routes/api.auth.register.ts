import { sdk } from '@libs/util/server/client.server';
import { setAuthToken } from '@libs/util/server/cookies.server';
import { data, redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form      = await request.formData();
  const firstName = String(form.get('firstName') ?? '').trim();
  const lastName  = String(form.get('lastName') ?? '').trim();
  const email     = String(form.get('email') ?? '').trim();
  const password  = String(form.get('password') ?? '');
  const phone     = String(form.get('phone') ?? '').trim();

  if (!firstName || !email || !password) {
    return data({ error: 'Nama, email, dan password harus diisi.' }, { status: 400 });
  }

  if (password.length < 8) {
    return data({ error: 'Password minimal 8 karakter.' }, { status: 400 });
  }

  try {
    const registerResult = await sdk.auth.register('customer', 'emailpass', { email, password });

    const token = typeof registerResult === 'string' ? registerResult : null;
    if (!token) {
      return data({ error: 'Registrasi gagal. Coba lagi.' }, { status: 500 });
    }

    await sdk.store.customer.create(
      { email, first_name: firstName, last_name: lastName || undefined, phone: phone || undefined },
      {},
      { authorization: `Bearer ${token}` },
    );

    const headers = new Headers();
    await setAuthToken(headers, token);

    return redirect('/account', { headers });
  } catch (err: any) {
    const msg: string = err?.message ?? '';
    const httpStatus: number = err?.status ?? err?.statusCode ?? 0;

    const isDuplicate =
      httpStatus === 409 ||
      msg.toLowerCase().includes('exist') ||
      msg.toLowerCase().includes('duplicate') ||
      msg.toLowerCase().includes('already') ||
      msg.toLowerCase().includes('conflict');

    if (isDuplicate) {
      return data({ error: 'Email sudah terdaftar. Silakan login.' }, { status: 409 });
    }

    return data({ error: `Registrasi gagal. Coba lagi. (${msg || httpStatus || 'unknown'})` }, { status: 500 });
  }
};
