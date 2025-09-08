import { ListDroppable } from '@/components/DragDrop/ListDroppable';
import { ItemModal } from '@/components/TimeTable/ItemModal';
import { useTimeTableContext } from '@/components/TimeTable/TimeTableContext';
import { apiFetch } from '@/helpers/fetch';
import { ResourceType, ScheduleItem } from '@/types';
import { Alert, Stack } from '@chakra-ui/react';

export const TimeTable = () => {
  const { error, items, setItems, loadTimeTable, type, id, isLoading } =
    useTimeTableContext();

  const replaceItems = (items: ScheduleItem[], callback?: () => void) => {
    setItems(items);
    apiFetch(`/api/${type}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (response.ok && response.data.success) {
        loadTimeTable();
        if (callback) {
          callback();
        }
      } else {
        // TODO: show error
      }
    });
  };

  const updateItem = (index: number, update: ScheduleItem) => {
    setItems(items);
    apiFetch(`/api/${type}/${id}/items/${index}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    }).then((response) => {
      if (response.ok && response.data.success) {
        loadTimeTable();
      } else {
        // TODO: show error
      }
    });
  };

  return (
    <Stack>
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
      <ListDroppable
        isLoading={isLoading}
        items={items}
        replaceItems={replaceItems}
        updateItem={updateItem}
        allIncompleteItems={type === ResourceType.TEMPLATE}
      >
        <ItemModal existingItems={items} replaceItems={replaceItems} />
      </ListDroppable>
    </Stack>
  );
};
