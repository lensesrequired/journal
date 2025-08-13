import { DraggableItem, Item } from '@/components/DraggableItem';
import { ScheduleItem } from '@/types';
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

export const TimeTable = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<ScheduleItem[]>([
    {
      description: 'Morning Walk',
      isTask: true,
    },
    {
      description: 'Start Work',
      startTime: 8.5,
    },
    {
      description: 'Stand Up',
      startTime: 10.25,
      endTime: 10.5,
    },
    {
      description: 'Lunch',
      duration: 60,
      isTask: true,
    },
  ]);
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

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(
          ({ description }) => description === active.id,
        );
        const newIndex = items.findIndex(
          ({ description }) => description === over.id,
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const isDone = (item: Partial<ScheduleItem>) => {
    const itemTime = item.endTime || item.startTime;
    const itemHours = Math.floor(itemTime || 0);
    const itemMinutes = ((itemTime || 0) - Math.floor(itemTime || 0)) * 60;
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    if (item.isTask) {
      return item.isCompleted;
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
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={items.map(({ description }) => description)}
        strategy={verticalListSortingStrategy}
      >
        {items.map(({ description, ...rest }, index) => (
          <DraggableItem
            key={index.toString()}
            id={description}
            description={description}
            isDone={isDone(rest)}
            {...rest}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? <Item id={activeId} description={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
