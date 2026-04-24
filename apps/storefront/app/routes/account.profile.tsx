import { getCustomer, updateCustomer } from '@libs/util/server/data/customer.server';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { data, Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Profil — LuDo-Chi' }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  return data({ customer });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form      = await request.formData();
  const firstName = String(form.get('firstName') ?? '').trim();
  const lastName  = String(form.get('lastName') ?? '').trim();
  const phone     = String(form.get('phone') ?? '').trim();

  if (!firstName) return data({ error: 'Nama depan harus diisi.' }, { status: 400 });

  try {
    await updateCustomer(request, {
      first_name: firstName,
      last_name:  lastName || undefined,
      phone:      phone    || undefined,
    });
    return data({ success: true });
  } catch {
    return data({ error: 'Gagal menyimpan perubahan. Coba lagi.' }, { status: 500 });
  }
};

const inputCls = 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200';
const inputStyle = {
  backgroundColor: '#FFFAF4',
  border: '1.5px solid #E2CCB0',
  color: '#3D2B1F',
  fontFamily: 'var(--font-body)',
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = '#6B3A1F');
const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = '#E2CCB0');

export default function ProfilePage() {
  const { customer } = useLoaderData<typeof loader>();
  const actionData   = useActionData<{ error?: string; success?: boolean }>();
  const navigation   = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5" style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}>
        <Link to="/account" className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
          <ArrowLeftIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
        </Link>
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-label)' }}>Akun</p>
          <h1 className="text-lg font-semibold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>Profil Saya</h1>
        </div>
      </div>

      <div className="px-5 pt-6">

        {/* Feedback */}
        {actionData?.success && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FFF3E4', color: '#6B3A1F', border: '1px solid #E2CCB0', fontFamily: 'var(--font-body)' }}>
            ✓ Profil berhasil diperbarui.
          </div>
        )}
        {actionData?.error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-5">

          {/* Email — read only */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}>
              Email
            </label>
            <input type="email" value={customer.email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} style={inputStyle} />
            <p className="mt-1 text-[11px]" style={{ color: '#B0A090', fontFamily: 'var(--font-body)' }}>Email tidak dapat diubah.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Nama Depan</label>
              <input id="firstName" name="firstName" type="text" defaultValue={customer.first_name ?? ''} required className={`${inputCls} px-3`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Nama Belakang</label>
              <input id="lastName" name="lastName" type="text" defaultValue={customer.last_name ?? ''} className={`${inputCls} px-3`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>No. HP</label>
            <input id="phone" name="phone" type="tel" defaultValue={customer.phone ?? ''} placeholder="08xxxxxxxxxx" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all disabled:opacity-60"
            style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}
          >
            {isSubmitting ? 'Menyimpan…' : 'SIMPAN PERUBAHAN'}
          </button>

        </Form>
      </div>
    </div>
  );
}
