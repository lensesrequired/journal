'use client';

import { Schedule } from '@/components/Schedule';
import { Today } from '@/components/Today';
import { Box, SegmentGroup } from '@chakra-ui/react';
import { useState } from 'react';

export const Home = () => {
  const [value, setValue] = useState<string | null>('Schedule');
  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={3}>
      <SegmentGroup.Root value={value} onValueChange={(e) => setValue(e.value)}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={['Schedule', 'Today']} />
      </SegmentGroup.Root>
      {value === 'Schedule' && <Schedule />}
      {value === 'Today' && <Today />}
    </Box>
  );
};
