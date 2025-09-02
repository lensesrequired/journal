import { Home as Default } from '@/components/pages/Home';
import withAuth from '@/components/withAuth';

async function Schedule() {
  return <Default />;
}

export default withAuth(Schedule);
