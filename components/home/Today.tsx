import { TimeTable } from '@/components/TimeTable';
import { TimeTableProvider } from '@/components/TimeTable/TimeTableContext';
import { ToDoList } from '@/components/ToDo';
import { UseTemplateModal } from '@/components/templates/UseTemplateModal';
import { ResourceType } from '@/types';
import { Box, Button, Heading, Stack } from '@chakra-ui/react';

export const Today = () => {
  const date = new Date().toISOString().split('T')[0];

  return (
    <Box
      p={5}
      width="100%"
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gridAutoRows="minmax(120px, auto)"
      gap={5}
    >
      <Box gridColumn={1} gridRow={'1 / span 3'}>
        <Box display="grid" gap={2}>
          <Heading as="h5" size="md">
            Schedule
          </Heading>
          <TimeTableProvider type={ResourceType.SCHEDULE} id={date}>
            <UseTemplateModal />
            <TimeTable />
          </TimeTableProvider>
        </Box>
      </Box>
      <Box gridColumn={2} gridRow={1}>
        <Stack>
          <Heading as="h3" size="2xl">
            To Do
          </Heading>
          <ToDoList />
        </Stack>
      </Box>
      <Box gridColumn={2} gridRow={2}>
        Habits
      </Box>
      <Box gridColumn={2} gridRow={3}>
        Events
      </Box>
      <Box gridColumn={2} gridRow={4}>
        <Button width="100%">Add Reminder</Button>
      </Box>
    </Box>
  );
};
