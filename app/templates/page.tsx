import { Templates as TemplatesComp } from '@/components/pages/Templates';
import withAuth from '@/components/withAuth';

async function Templates() {
  return <TemplatesComp />;
}

export default withAuth(Templates);
