'use client';

import { Overview } from '@/components/home/Overview';
import { Today } from '@/components/home/Today';
import { Box, SegmentGroup } from '@chakra-ui/react';
import { useState } from 'react';

export const Home = () => {
  const [value, setValue] = useState<string | null>('Overview');
  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={3}>
      <SegmentGroup.Root value={value} onValueChange={(e) => setValue(e.value)}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={['Overview', 'Today']} />
      </SegmentGroup.Root>
      {value === 'Overview' && <Overview />}
      {value === 'Today' && <Today />}
    </Box>
  );
};
