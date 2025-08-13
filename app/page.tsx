import { Auth } from '@/components/Auth';
import { Home as Default } from '@/components/Home';
import withAuth from '@/components/withAuth';
import { AuthProps } from '@/types';

async function Home({ authed }: AuthProps) {
  if (authed) {
    return <Default />;
  }
  return <Auth />;
}

export default withAuth(Home, true);
