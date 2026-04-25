import { Address } from '@libs/types';
import { BaseCartAddress } from '@medusajs/types/dist/http/cart/common';
import { type FC, useCallback } from 'react';

export interface StripeAddress {
  address: Address;
  completed: boolean;
}

export const defaultStripeAddress = (address?: BaseCartAddress | null | undefined): StripeAddress => ({
  address: {
    firstName: address?.first_name || '',
    lastName: address?.last_name || '',
    address1: address?.address_1 || '',
    address2: address?.address_2 || '',
    province: address?.province || '',
    city: address?.city || '',
    countryCode: address?.country_code || 'id',
    postalCode: address?.postal_code || '',
    phone: address?.phone || '',
  },
  completed: false,
});

interface AddressFormProps {
  title?: string;
  address: Address;
  mode?: string;
  allowedCountries?: string[];
  setAddress: (address: StripeAddress) => void;
}

const fieldStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.875rem',
  backgroundColor: '#FFFAF4',
  color: '#3D2B1F',
  border: '1px solid #E2CCB0',
  borderRadius: '8px',
  outline: 'none',
  fontFamily: 'var(--font-body)',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.6rem',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: '#9C8070',
  marginBottom: '4px',
  fontFamily: 'var(--font-label)',
};

export const MedusaStripeAddress: FC<AddressFormProps> = ({ title, address, setAddress }) => {
  const update = useCallback(
    (field: keyof Address, value: string) => {
      const updated: Address = { ...address, [field]: value };
      setAddress({
        address: updated,
        completed: !!(
          updated.address1 &&
          updated.city &&
          updated.postalCode &&
          updated.countryCode
        ),
      });
    },
    [address, setAddress],
  );

  return (
    <div className="space-y-3 mt-3">
      {title && (
        <h3
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
        >
          {title}
        </h3>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Nama Depan</label>
          <input
            style={fieldStyle}
            value={address.firstName ?? ''}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="Budi"
          />
        </div>
        <div>
          <label style={labelStyle}>Nama Belakang</label>
          <input
            style={fieldStyle}
            value={address.lastName ?? ''}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Santoso"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Alamat</label>
        <input
          style={fieldStyle}
          value={address.address1 ?? ''}
          onChange={(e) => update('address1', e.target.value)}
          placeholder="Jl. Contoh No. 1"
        />
      </div>

      <div>
        <label style={labelStyle}>Alamat 2 (opsional)</label>
        <input
          style={fieldStyle}
          value={address.address2 ?? ''}
          onChange={(e) => update('address2', e.target.value)}
          placeholder="RT/RW, Gedung, Lantai..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Kota</label>
          <input
            style={fieldStyle}
            value={address.city ?? ''}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Jakarta"
          />
        </div>
        <div>
          <label style={labelStyle}>Provinsi</label>
          <input
            style={fieldStyle}
            value={address.province ?? ''}
            onChange={(e) => update('province', e.target.value)}
            placeholder="DKI Jakarta"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Kode Pos</label>
          <input
            style={fieldStyle}
            value={address.postalCode ?? ''}
            onChange={(e) => update('postalCode', e.target.value)}
            placeholder="14350"
          />
        </div>
        <div>
          <label style={labelStyle}>Kode Negara</label>
          <input
            style={fieldStyle}
            value={address.countryCode ?? 'id'}
            onChange={(e) => update('countryCode', e.target.value)}
            placeholder="id"
            maxLength={2}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Nomor Telepon</label>
        <input
          style={fieldStyle}
          value={address.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+62812..."
          type="tel"
        />
      </div>
    </div>
  );
};
