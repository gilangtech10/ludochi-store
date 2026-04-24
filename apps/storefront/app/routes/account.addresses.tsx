import { getCustomer } from '@libs/util/server/data/customer.server';
import { sdk } from '@libs/util/server/client.server';
import { withAuthHeaders } from '@libs/util/server/auth.server';
import { ArrowLeftIcon, MapPinIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { data, Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Alamat — LuDo-Chi' }];

const listAddresses = withAuthHeaders(async (request, authHeaders) =>
  sdk.store.customer.listAddress({}, authHeaders).then(({ addresses }) => addresses).catch(() => [])
);

const createAddress = withAuthHeaders(async (request, authHeaders, body: any) =>
  sdk.store.customer.createAddress(body, {}, authHeaders)
);

const deleteAddress = withAuthHeaders(async (request, authHeaders, id: string) =>
  sdk.store.customer.deleteAddress(id, authHeaders)
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  const addresses = await listAddresses(request);
  return data({ addresses });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form   = await request.formData();
  const intent = String(form.get('intent') ?? '');

  if (intent === 'delete') {
    await deleteAddress(request, String(form.get('id') ?? '')).catch(() => null);
    return data({ success: 'Alamat berhasil dihapus.' });
  }

  if (intent === 'create') {
    const firstName = String(form.get('firstName') ?? '').trim();
    const lastName  = String(form.get('lastName')  ?? '').trim();
    const address1  = String(form.get('address1')  ?? '').trim();
    const city      = String(form.get('city')      ?? '').trim();
    const province  = String(form.get('province')  ?? '').trim();
    const postal    = String(form.get('postal')    ?? '').trim();
    const phone     = String(form.get('phone')     ?? '').trim();

    if (!firstName || !address1 || !city)
      return data({ error: 'Nama, alamat, dan kota harus diisi.' }, { status: 400 });

    try {
      await createAddress(request, {
        first_name: firstName,
        last_name:  lastName  || undefined,
        address_1:  address1,
        city,
        province:     province || undefined,
        postal_code:  postal   || undefined,
        phone:        phone    || undefined,
        country_code: 'id',
      });
      return data({ success: 'Alamat berhasil ditambahkan.' });
    } catch {
      return data({ error: 'Gagal menambahkan alamat.' }, { status: 500 });
    }
  }

  return data({});
};

const inputCls  = 'w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all';
const inputStyle = { backgroundColor: '#FFFAF4', border: '1.5px solid #E2CCB0', color: '#3D2B1F', fontFamily: 'var(--font-body)' };
const onFocus    = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = '#6B3A1F');
const onBlur     = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = '#E2CCB0');

export default function AddressesPage() {
  const { addresses } = useLoaderData<typeof loader>();
  const actionData    = useActionData<{ error?: string; success?: string }>();
  const navigation    = useNavigation();
  const isSubmitting  = navigation.state === 'submitting';

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5" style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}>
        <Link to="/account" className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
          <ArrowLeftIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
        </Link>
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-label)' }}>Akun</p>
          <h1 className="text-lg font-semibold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>Alamat Saya</h1>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">

        {/* Feedback */}
        {actionData?.success && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FFF3E4', color: '#6B3A1F', border: '1px solid #E2CCB0', fontFamily: 'var(--font-body)' }}>
            ✓ {actionData.success}
          </div>
        )}
        {actionData?.error && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
            {actionData.error}
          </div>
        )}

        {/* Daftar alamat */}
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-2xl px-4 py-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C47C3A' }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>
                    {[addr.first_name, addr.last_name].filter(Boolean).join(' ')}
                  </p>
                  <p className="text-sm mt-0.5 leading-snug" style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)' }}>
                    {[addr.address_1, addr.address_2, addr.city, addr.province, addr.postal_code].filter(Boolean).join(', ')}
                  </p>
                  {addr.phone && (
                    <p className="text-xs mt-0.5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>{addr.phone}</p>
                  )}
                </div>
              </div>
              <Form method="post" className="flex-shrink-0">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id"     value={addr.id} />
                <button type="submit" className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#FEF2F2' }} aria-label="Hapus">
                  <TrashIcon className="w-4 h-4" style={{ color: '#B91C1C' }} />
                </button>
              </Form>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#FFF3E4' }}>
              <MapPinIcon className="w-6 h-6" style={{ color: '#C4A882' }} />
            </div>
            <p className="text-sm" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>Belum ada alamat tersimpan.</p>
          </div>
        )}

        {/* ── Pemisah ── */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px" style={{ backgroundColor: '#E2CCB0' }} />
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}>Tambah Alamat</p>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E2CCB0' }} />
        </div>

        {/* Form tambah alamat */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <Form method="post" className="px-4 pt-4 pb-5 space-y-3.5">
            <input type="hidden" name="intent" value="create" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Nama Depan *</label>
                <input name="firstName" type="text" required placeholder="Budi" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Nama Belakang</label>
                <input name="lastName" type="text" placeholder="Santoso" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Alamat Lengkap *</label>
              <input name="address1" type="text" required placeholder="Jl. Contoh No. 123" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Kota *</label>
                <input name="city" type="text" required placeholder="Jakarta" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Provinsi</label>
                <input name="province" type="text" placeholder="DKI Jakarta" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>Kode Pos</label>
                <input name="postal" type="text" placeholder="12345" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}>No. HP</label>
                <input name="phone" type="tel" placeholder="0812xxxx" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all disabled:opacity-60"
              style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}
            >
              {isSubmitting ? 'Menyimpan…' : 'SIMPAN ALAMAT'}
            </button>
          </Form>
        </div>

      </div>
    </div>
  );
}
