'use client';

import { HStack, Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/schedule', label: 'Schedule' },
  { href: '/habits', label: 'Habits' },
  { href: '/trackers', label: 'Trackers' },
];

export const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <HStack gap={8} pt={1}>
      {navLinks.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={label.toLowerCase()}
            href={href}
            variant={isActive ? 'underline' : 'plain'}
            color={isActive ? 'white' : 'lightgray'}
          >
            {label}
          </Link>
        );
      })}
    </HStack>
  );
};
