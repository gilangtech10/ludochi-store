import { getCustomer } from '@libs/util/server/data/customer.server';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { data, Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Login — LuDo-Chi' }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (customer) return redirect('/account');
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') ?? '/account';
  return data({ redirectTo });
};

export default function LoginPage() {
  const { redirectTo } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 pb-20"
      style={{ backgroundColor: '#FFFAF4' }}
    >
      {/* Logo / brand */}
      <div className="mb-8 text-center">
        <Link to="/" aria-label="Kembali ke beranda">
          <span
            className="text-3xl select-none"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#3D2B1F', letterSpacing: '0.04em' }}
          >
            LuDo-Chi
          </span>
        </Link>
        <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}>
          ドーナツと餅パン
        </p>
      </div>

      <div
        className="w-full max-w-sm rounded-2xl p-7"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(61,43,31,0.10)', border: '1px solid #F0E6D6' }}
      >
        <h1
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
        >
          Selamat Datang
        </h1>
        <p className="text-sm mb-6" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
          Masuk ke akun LuDo-Chi kamu
        </p>

        {actionData?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}
          >
            {actionData.error}
          </div>
        )}

        <Form method="post" action="/api/auth/login" className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
              style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@email.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: '#FFFAF4',
                border: '1.5px solid #E2CCB0',
                color: '#3D2B1F',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#6B3A1F')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E2CCB0')}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
              style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: '#FFFAF4',
                  border: '1.5px solid #E2CCB0',
                  color: '#3D2B1F',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#6B3A1F')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E2CCB0')}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPass
                  ? <EyeSlashIcon className="w-5 h-5" style={{ color: '#9C8070' }} />
                  : <EyeIcon className="w-5 h-5" style={{ color: '#9C8070' }} />
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60"
            style={{
              backgroundColor: '#6B3A1F',
              color: '#FFFAF4',
              fontFamily: 'var(--font-label)',
              letterSpacing: '0.06em',
            }}
          >
            {isSubmitting ? 'Masuk…' : 'MASUK'}
          </button>
        </Form>

        <p className="mt-5 text-center text-sm" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
          Belum punya akun?{' '}
          <Link
            to="/account/register"
            className="font-semibold transition-colors duration-200"
            style={{ color: '#6B3A1F' }}
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
