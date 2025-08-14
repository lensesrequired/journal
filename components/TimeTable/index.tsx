import { DraggableItem, Item } from '@/components/TimeTable/DraggableItem';
import { ItemModal } from '@/components/TimeTable/ItemModal';
import { RemoveItemDroppable } from '@/components/TimeTable/RemoveItemDroppable';
import { useTimeTableContext } from '@/components/TimeTable/TimeTableContext';
import { apiFetch } from '@/helpers/fetch';
import { ScheduleItem, TimeTableType } from '@/types';
import { Alert, Stack } from '@chakra-ui/react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent } from '@dnd-kit/core/dist/types';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';

type Props = {
  type: TimeTableType;
  id: string;
};

export const TimeTable = ({ type, id }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isLoading, error, items, setItems, loadTimeTable } =
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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (items && over && active.id !== over.id) {
      if (over.id === 'remove-item') {
        replaceItems(
          items.filter(({ description }) => description !== active.id),
        );
      } else {
        const oldIndex = items.findIndex(
          ({ description }) => description === active.id,
        );
        const newIndex = items.findIndex(
          ({ description }) => description === over.id,
        );

        replaceItems(arrayMove(items, oldIndex, newIndex));
      }
    }
    setActiveId(null);
  };

  const isDone = (item: Partial<ScheduleItem>) => {
    const itemTime = item.endTime || item.startTime;
    const itemHours = Math.floor(itemTime || 0);
    const itemMinutes = ((itemTime || 0) - Math.floor(itemTime || 0)) * 60;
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    if (item.isTask) {
      return item.isCompleted === true;
    }
    if (itemTime) {
      return (
        currentHours > itemHours ||
        (currentHours === itemHours && currentMinutes > itemMinutes)
      );
    }
    return false;
  };

  return (
    <Stack>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={(items || []).map(({ description }) => description)}
          strategy={verticalListSortingStrategy}
        >
          {error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          )}
          {!activeId ? (
            <ItemModal
              existingItems={items || []}
              replaceItems={replaceItems}
            />
          ) : (
            <RemoveItemDroppable />
          )}
          <Stack display="grid" flex={1}>
            {(items || []).map(({ description, ...rest }, index) => (
              <DraggableItem
                key={index.toString()}
                id={description}
                description={description}
                isDone={type === TimeTableType.SCHEDULE ? isDone(rest) : false}
                isLoading={isLoading}
                onChange={() => {
                  if (rest.isTask) {
                    updateItem(index, {
                      description,
                      ...rest,
                      isCompleted: !rest.isCompleted,
                    });
                  }
                }}
                {...rest}
              />
            ))}
          </Stack>
        </SortableContext>
        <DragOverlay>
          {activeId ? <Item id={activeId} description={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </Stack>
  );
};
