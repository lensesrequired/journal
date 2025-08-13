import { TimeTable } from '@/components/TimeTable';
import { ItemModal } from '@/components/schedule/ItemModal';
import { apiFetch } from '@/helpers/fetch';
import { ScheduleItem } from '@/types';
import { Alert, Box, Button } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

// [
//   {
//     description: 'Morning Walk',
//     isCompleted: true,
//     isTask: true,
//   },
//   {
//     description: 'Start Work',
//     startTime: 8.5,
//   },
//   {
//     description: 'Stand Up',
//     startTime: 10.25,
//     endTime: 10.5,
//   },
//   {
//     description: 'Lunch',
//     duration: 60,
//     isTask: true,
//   },
// ]

export const Today = () => {
  const date = new Date().toISOString().split('T')[0];
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ScheduleItem[]>();

  const loadTimeTable = useCallback(async () => {
    apiFetch(`/api/schedule/${date}`, {}).then((response) => {
      if (response.ok) {
        setItems(response.data.items);
        setError(null);
      } else {
        setError(response.error || 'Something went wrong. Please try again.');
      }
    });
  }, [date]);

  useEffect(() => {
    if (!items) {
      loadTimeTable();
    }
  }, [items, loadTimeTable]);

  const replaceItems = (items: ScheduleItem[], callback?: () => void) => {
    apiFetch(`/api/schedule/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (response.ok && response.data.success) {
        loadTimeTable();
        callback && callback();
      } else {
        // TODO: show error
      }
    });
  };

  return (
    <Box
      p={5}
      width="100%"
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gridAutoRows="minmax(120px, auto)"
      gap={5}
    >
      <Box gridColumn={1} display="grid" gap={2}>
        Schedule
        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}
        <Button width="100%">Use Template</Button>
        <ItemModal existingItems={items || []} replaceItems={replaceItems} />
        <TimeTable existingItems={items || []} replaceItems={replaceItems} />
      </Box>
      <Box gridColumn={2} gridRow={1}>
        <Button width="100%">Add Todo</Button>
      </Box>
      <Box gridColumn={2} gridRow={2}>
        Habits
      </Box>
      <Box gridColumn={2} gridRow={3}>
        <Button width="100%">Add Reminder</Button>
      </Box>
    </Box>
  );
};
