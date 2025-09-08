import { ListDroppable } from '@/components/DragDrop/ListDroppable';
import { ItemModal } from '@/components/ToDo/ItemModal';
import { apiFetch } from '@/helpers/fetch';
import { ResourceType, ToDoItem } from '@/types';
import { Alert, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

export const ToDoList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ToDoItem[] | null>(null);

  const loadToDos = useCallback(async () => {
    setIsLoading(true);
    apiFetch(`/api/${ResourceType.TODO}/${ResourceType.TODO}`, {}).then(
      (response) => {
        if (response.ok) {
          setItems(response.data.items);
          setError(null);
        } else {
          setError(response.error || 'Something went wrong. Please try again.');
        }
        setIsLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (!items) {
      loadToDos();
    }
  }, [items, loadToDos]);

  const replaceItems = (items: ToDoItem[], callback?: () => void) => {
    setItems(items);
    apiFetch(`/api/${ResourceType.TODO}/${ResourceType.TODO}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (response.ok && response.data.success) {
        loadToDos();
        if (callback) {
          callback();
        }
      } else {
        // TODO: show error
      }
    });
  };

  const updateItem = (index: number, update: ToDoItem) => {
    setItems(items);
    apiFetch(`/api/${ResourceType.TODO}/${ResourceType.TODO}/items/${index}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    }).then((response) => {
      if (response.ok && response.data.success) {
        loadToDos();
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
        items={items || []}
        replaceItems={replaceItems}
        updateItem={updateItem}
      >
        <ItemModal existingItems={items || []} replaceItems={replaceItems} />
      </ListDroppable>
    </Stack>
  );
};
