import type { Address } from '@libs/types';

export const AddressDisplay: React.FC<{
  title?: string;
  address: Address;
  countryOptions: { value: string; label: string }[];
}> = ({ title, address, countryOptions }) => (
  <span>
    {title && (
      <dt
        className="mt-2 mb-1.5 block text-[10px] font-semibold tracking-[0.2em] uppercase"
        style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
      >
        {title}
      </dt>
    )}
    <dd
      className="mt-0.5 leading-relaxed"
      style={{ fontFamily: 'var(--font-body)', color: '#7A5C4E', fontSize: '0.875rem' }}
    >
      {address?.company && (
        <>
          {address?.company}
          <br />
        </>
      )}
      {address?.address1}
      <br />
      {address?.address2 && (
        <>
          {address?.address2}
          <br />
        </>
      )}
      {address?.city}, {address?.province} {address?.postalCode}
      <br />
      {address?.countryCode && (
        <>
          {countryOptions.find(({ value }) => value === address?.countryCode)?.label}
          <br />
        </>
      )}
    </dd>
  </span>
);
