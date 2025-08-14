import { TimeTable } from '@/components/TimeTable';
import { Box, Button } from '@chakra-ui/react';

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
      <Box gridColumn={1} gridRow={'1 / span 3'} display="grid" gap={2}>
        Schedule
        <Button width="100%">Use Template</Button>
        <TimeTable date={date} />
      </Box>
      <Box gridColumn={2} gridRow={1}>
        <Button width="100%">Add Todo</Button>
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
