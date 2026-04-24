import { removeAuthToken } from '@libs/util/server/cookies.server';
import { redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();
  await removeAuthToken(headers);
  return redirect('/', { headers });
};
