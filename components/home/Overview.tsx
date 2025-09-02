import { TimeTable } from '@/components/TimeTable';
import { TimeTableProvider } from '@/components/TimeTable/TimeTableContext';
import { UseTemplateModal } from '@/components/templates/UseTemplateModal';
import { TimeTableType } from '@/types';
import { Box, HStack, Heading, Input, Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

export const Overview = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split('T')[0],
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate()))
      .toISOString()
      .split('T')[0],
  );
  const duration = useMemo(
    () =>
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        1000 /
        60 /
        60 /
        24 +
      1,
    [startDate, endDate],
  );
  const dates = useMemo(
    () =>
      Array.from(Array(duration).keys()).map(
        (_, i) =>
          new Date(
            new Date(startDate).setDate(new Date(startDate).getDate() + i),
          )
            .toISOString()
            .split('T')[0],
      ),
    [duration, startDate],
  );

  return (
    <Box
      p={5}
      width="100%"
      height="100%"
      display="grid"
      gridTemplateColumns="minmax(0, 2fr) 1fr"
      gridAutoRows="minmax(120px, auto)"
      gap={5}
    >
      <Stack
        p={3}
        gridColumn={1}
        gridRow={'1 / span 3'}
        display="grid"
        gridTemplateRows="auto auto 1fr"
      >
        <Heading as="h1" size="2xl">
          Calendar
        </Heading>
        <HStack justifyContent="flex-start">
          <div style={{ flexGrow: 2 }}>Date Range:</div>
          <Input
            flexGrow={2}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>&mdash;</span>
          <Input
            flexGrow={1}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </HStack>
        <HStack
          gap={3}
          overflowX="auto"
          whiteSpace="nowrap"
          flex={1}
          alignItems="start"
        >
          {duration <= 14
            ? dates.map((id) => (
                <TimeTableProvider
                  key={id}
                  type={TimeTableType.SCHEDULE}
                  id={id}
                >
                  <Stack minWidth={'300px'} maxWidth={'500px'} flex={1}>
                    <HStack>
                      <Heading as="h5" size="lg">
                        {new Date(id).toDateString()}
                      </Heading>
                    </HStack>
                    <UseTemplateModal />
                    <TimeTable />
                  </Stack>
                </TimeTableProvider>
              ))
            : 'Date range too large. It should be no more than 14 days'}
        </HStack>
      </Stack>
      <Box gridColumn={2} gridRow={1}>
        Upcoming Events
      </Box>
      <Box gridColumn={2} gridRow={2}>
        Habits
      </Box>
      <Box gridColumn={2} gridRow={3}>
        Today Preview
      </Box>
    </Box>
  );
};
