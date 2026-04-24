import { LoaderFunctionArgs, redirect } from 'react-router';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const handle = params.categoryHandle as string;
  return redirect(`/products?category=${encodeURIComponent(handle)}`);
};

export default function CategoriesRedirectRoute() {
  return null;
}
