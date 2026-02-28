import type { Address } from '@libs/types';

export const AddressDisplay: React.FC<{
  title?: string;
  address: Address;
  countryOptions: { value: string; label: string }[];
}> = ({ title, address, countryOptions }) => (
  <span>
    {title && <dt className="academia-label mt-4 mb-2 block">{title}</dt>}
    <dd
      className="mt-0.5 leading-relaxed"
      style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.75)', fontSize: '0.9rem' }}
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
