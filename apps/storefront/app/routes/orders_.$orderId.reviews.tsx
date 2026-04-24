import { redirect, type LoaderFunctionArgs } from 'react-router';

export const loader = (_args: LoaderFunctionArgs) => {
  throw redirect('/');
};

export default function OrderReviewsRoute() {
  return null;
}
