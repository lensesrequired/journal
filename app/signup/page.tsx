import { Auth } from '@/components/pages/Auth';

async function CreateAccount({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo: string | undefined }>;
}) {
  const { redirectTo } = await searchParams;

  return <Auth createAccount redirectTo={redirectTo || ''} />;
}

export default CreateAccount;
