'use client';

import { Overview } from '@/components/home/Overview';
import { Today } from '@/components/home/Today';
import { capitalizeWords } from '@/helpers/string';
import { Box, SegmentGroup } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

enum View {
  OVERVIEW = 'overview',
  TODAY = 'today',
}

export const Home = ({}) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const [value, setValue] = useState<View | null>(
    (view as View) || View.OVERVIEW,
  );

  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={3}>
      <SegmentGroup.Root
        value={value}
        onValueChange={(e) => setValue((e.value || '').toLowerCase() as View)}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items
          items={Object.values(View).map((view) => capitalizeWords(view))}
        />
      </SegmentGroup.Root>
      {value === View.OVERVIEW && <Overview />}
      {value === View.TODAY && <Today />}
    </Box>
  );
};
