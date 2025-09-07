import { DraggableItem, Item } from '@/components/DragDrop/DraggableItem';
import { RemoveItemDroppable } from '@/components/DragDrop/RemoveItemDroppable';
import { ItemModal } from '@/components/TimeTable/ItemModal';
import { ScheduleItem } from '@/types';
import { Stack } from '@chakra-ui/react';
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
  isLoading: boolean;
  items: ScheduleItem[];
  replaceItems: (items: ScheduleItem[], callback?: () => void) => void;
  updateItem: (index: number, items: ScheduleItem) => void;
  allIncompleteItems?: boolean;
};

export const ListDroppable = ({
  isLoading,
  items,
  replaceItems,
  updateItem,
  allIncompleteItems,
}: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

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
                isDone={allIncompleteItems ? false : isDone(rest)}
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
