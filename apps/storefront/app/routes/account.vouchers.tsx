import { getCustomer } from '@libs/util/server/data/customer.server';
import { getCartId } from '@libs/util/server/cookies.server';
import { sdk } from '@libs/util/server/client.server';
import { ArrowLeftIcon, TagIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { data, Form, Link, redirect, useActionData, useNavigation } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Voucher — LuDo-Chi' }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  return data({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const code = String(form.get('code') ?? '').trim().toUpperCase();

  if (!code) return data({ error: 'Masukkan kode voucher.' }, { status: 400 });

  const cartId = await getCartId(request.headers);

  if (!cartId) {
    return data({ saved: code, message: 'Kode disimpan. Gunakan saat checkout.' });
  }

  try {
    await sdk.store.cart.update(cartId, { promo_codes: [code] });
    return data({ saved: code, message: `Voucher "${code}" berhasil diterapkan ke keranjang!`, applied: true });
  } catch (err: any) {
    const msg: string = err?.message ?? '';
    if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('exist')) {
      return data({ error: `Kode "${code}" tidak valid atau sudah kadaluarsa.` }, { status: 400 });
    }
    return data({ saved: code, message: 'Kode disimpan. Tempelkan saat checkout.' });
  }
};

export default function VouchersPage() {
  const actionData   = useActionData<{ error?: string; saved?: string; message?: string; applied?: boolean }>();
  const navigation   = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const inputStyle = {
    backgroundColor: '#FFFAF4',
    border: '1.5px solid #E2CCB0',
    color: '#3D2B1F',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5" style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}>
        <Link to="/account" className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
          <ArrowLeftIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
        </Link>
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-label)' }}>Akun</p>
          <h1 className="text-lg font-semibold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>Voucher & Promo</h1>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">

        {/* Hero banner */}
        <div
          className="rounded-2xl px-5 py-6 flex items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #C47C3A 0%, #A0581C 100%)',
            boxShadow: '0 6px 24px rgba(100,58,31,0.20)',
          }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
            <TagIcon className="w-6 h-6" style={{ color: '#FFFAF4' }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,250,244,0.70)', fontFamily: 'var(--font-label)' }}>
              プロモ
            </p>
            <p className="text-base font-bold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>
              Redeem Voucher
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,250,244,0.65)', fontFamily: 'var(--font-body)' }}>
              Masukkan kode promo untuk mendapat diskon
            </p>
          </div>
        </div>

        {/* Feedback */}
        {actionData?.message && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FFF3E4', color: '#6B3A1F', border: '1px solid #E2CCB0', fontFamily: 'var(--font-body)' }}>
            ✓ {actionData.message}
          </div>
        )}
        {actionData?.error && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
            {actionData.error}
          </div>
        )}

        {/* Kode tersimpan */}
        {actionData?.saved && (
          <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2.5" style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}>
              Kode Tersimpan
            </p>
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: '#FFF3E4', border: '1.5px dashed #E2CCB0' }}
            >
              <span className="text-base font-bold tracking-widest" style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)' }}>
                {actionData.saved}
              </span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(actionData.saved!)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all active:scale-95"
                style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
              >
                <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                Salin
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
              Gunakan kode ini saat checkout untuk mendapat diskon.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl px-4 py-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>
            Masukkan Kode Voucher
          </p>
          <Form method="post" className="space-y-3">
            <input
              name="code"
              type="text"
              required
              placeholder="Contoh: LUDOCHI10"
              autoCapitalize="characters"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all tracking-widest font-semibold"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#6B3A1F')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#E2CCB0')}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all disabled:opacity-60"
              style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}
            >
              {isSubmitting ? 'Memvalidasi…' : 'REDEEM VOUCHER'}
            </button>
          </Form>
        </div>

        {/* Cara pakai */}
        <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}>
            Cara Penggunaan
          </p>
          {[
            'Dapatkan kode voucher dari promo LuDo-Chi di Instagram atau WhatsApp.',
            'Masukkan kode di atas dan tekan Redeem.',
            'Kode diterapkan otomatis ke keranjang belanja aktif.',
            'Jika belum ada keranjang, salin kode dan tempelkan di halaman checkout.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3 mb-2.5">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ backgroundColor: '#FFF3E4', color: '#C47C3A', fontFamily: 'var(--font-label)', border: '1px solid #E2CCB0' }}
              >
                {i + 1}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
