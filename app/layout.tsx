import { ProfileMenu } from '@/components/ProfileMenu';
import { Provider } from '@/components/ui/provider';
import { getAuth } from '@/components/withAuth';
// import './globals.scss';
import { Box, Heading } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import { ReactNode } from 'react';

const outfit = Outfit({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Journal!',
};

async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const authProps = await getAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className}`}>
        <Provider>
          <Box
            py={3}
            px={4}
            m={1}
            bgColor="cyan.700"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderRadius: '.5rem',
            }}
          >
            <Link href="/">
              <Heading as="h1" size="4xl">
                Journal
              </Heading>
            </Link>
            {authProps.authed && <ProfileMenu {...authProps} />}
          </Box>
          {children}
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
