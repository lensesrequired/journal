import { Box } from '@chakra-ui/react';

export const Overview = () => {
  return (
    <Box
      p={5}
      width="100%"
      display="grid"
      gridTemplateColumns="2fr 1fr"
      gridAutoRows="minmax(120px, auto)"
    >
      <Box gridColumn={1}>Calendar</Box>
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
