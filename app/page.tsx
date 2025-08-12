import { Auth } from '@/components/Auth';
import withAuth from '@/components/withAuth';
import { AuthProps } from '@/types';

async function Home({ authed }: AuthProps) {
  if (authed) {
    return 'Authed';
  }
  return <Auth />;
}

export default withAuth(Home, true);
