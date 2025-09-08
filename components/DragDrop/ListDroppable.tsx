import { DraggableItem, Item } from '@/components/DragDrop/DraggableItem';
import { RemoveItemDroppable } from '@/components/DragDrop/RemoveItemDroppable';
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
import { ReactElement, ReactNode, useState } from 'react';

type Props<ItemType extends ScheduleItem> = {
  isLoading: boolean;
  items: ItemType[];
  replaceItems: (items: ItemType[], callback?: () => void) => void;
  updateItem: (index: number, items: ItemType) => void;
  allIncompleteItems?: boolean;
  children?: ReactNode;
};

export const ListDroppable: <ItemType extends ScheduleItem>(
  props: Props<ItemType>,
) => ReactElement = ({
  isLoading,
  items,
  replaceItems,
  updateItem,
  allIncompleteItems,
  children,
}) => {
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
          {!activeId ? children : <RemoveItemDroppable />}
          <Stack display="grid" flex={1}>
            {(items || []).map((item, index) => {
              const { description, ...rest } = item;
              return (
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
                      } as typeof item);
                    }
                  }}
                  {...rest}
                />
              );
            })}
          </Stack>
        </SortableContext>
        <DragOverlay>
          {activeId ? <Item id={activeId} description={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </Stack>
  );
};
