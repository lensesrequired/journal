import { Auth } from '@/components/pages/Auth';
import withAuth from '@/components/withAuth';
import { AuthProps } from '@/types';
import { RedirectType, redirect } from 'next/navigation';

async function Home({ authed }: AuthProps) {
  if (authed) {
    redirect('/schedule', RedirectType.replace);
    return null;
  }
  return <Auth />;
}

export default withAuth(Home, true);
