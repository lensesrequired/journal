'use client';

import { Overview } from '@/components/home/Overview';
import { Today } from '@/components/home/Today';
import { capitalizeWords } from '@/helpers/string';
import { Box, SegmentGroup } from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

enum View {
  TODAY = 'today',
  OVERVIEW = 'upcoming',
}

export const Home = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const [value, setValue] = useState<View | null>((view as View) || View.TODAY);

  useEffect(() => {
    if (value) {
      router.push(`${pathname}/?view=${value}`);
    }
  }, [pathname, router, value]);

  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={3}>
      <SegmentGroup.Root
        value={capitalizeWords(value || '')}
        onValueChange={(e) => setValue((e.value || '').toLowerCase() as View)}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items
          items={Object.values(View).map((view) => capitalizeWords(view))}
        />
      </SegmentGroup.Root>
      {value === View.TODAY && <Today />}
      {value === View.OVERVIEW && <Overview />}
    </Box>
  );
};
