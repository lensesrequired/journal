import { TimerModal } from '@/components/TimerModal';
import { decimalToTime, minutesToHoursString } from '@/helpers/time';
import { ScheduleItem } from '@/types';
import { CheckboxCard, Text } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormEvent, ForwardedRef, forwardRef } from 'react';

type ItemProps = ScheduleItem & {
  key?: string;
  id: string;
  isDone?: boolean;
  isLoading?: boolean;
  onChange?: (e: FormEvent<HTMLLabelElement>) => void;
};

export const Item = forwardRef(
  (
    {
      id,
      description,
      isDone,
      isTask,
      startTime,
      endTime,
      duration,
      isLoading,
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isCompleted,
      ...props
    }: ItemProps & {
      style?: {
        transform?: string;
        transition?: string;
      };
    },
    ref: ForwardedRef<HTMLLabelElement>,
  ) => {
    const height =
      ((duration || 0) / 60 ||
        (endTime || startTime || 0) - (startTime || 0) ||
        0.5) * 110;

    let display = '';
    if (startTime) {
      if (endTime) {
        display = `(${decimalToTime(startTime)}-${decimalToTime(endTime)})`;
      } else if (duration) {
        display = `(${decimalToTime(startTime)}-${decimalToTime(startTime + duration / 60)})`;
      } else {
        display = `(${decimalToTime(startTime)})`;
      }
    } else if (duration) {
      display = `(${minutesToHoursString(duration)})`;
    }

    return (
      <CheckboxCard.Root
        variant="surface"
        disabled={isLoading}
        ref={ref}
        id={id}
        {...props}
        minHeight="55px"
        height={`${height}px`}
        checked={isDone}
        onChange={onChange}
      >
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
          <CheckboxCard.Label>
            {description}
            {display && <Text color="gray">{display}</Text>}
          </CheckboxCard.Label>
          {duration && (
            <TimerModal description={description} duration={duration} />
          )}
          {isTask && <CheckboxCard.Indicator />}
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    );
  },
);
Item.displayName = 'Item';

export const DraggableItem = ({ id, ...rest }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setEventRef,
    transform,
    transition,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      ref={setEventRef}
      style={style}
      id={id}
      {...attributes}
      {...listeners}
      {...rest}
    />
  );
};
