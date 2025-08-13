import { cleanValues } from '@/helpers/form';
import { ScheduleItem } from '@/types';
import {
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Stack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type Props = {
  existingItems: ScheduleItem[];
  replaceItems: (items: ScheduleItem[]) => void;
};

export const ItemModal = ({ existingItems, replaceItems }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    control,
  } = useForm<ScheduleItem>({ mode: 'onBlur' });
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const onSubmit = handleSubmit((data) => {
    const newItem = cleanValues(data) as ScheduleItem;
    // const index = 0;
    // if (newItem.startTime) {
    //   index = existingItems.findIndex((item) => {
    //     if (item.startTime) {
    //       return item.startTime >= newItem.startTime;
    //     }
    //     return false
    //   });
    // } else if (newItem.endTime) {
    //   index = existingItems.findIndex((item) => {
    //     if(item.startTime) {
    //       return item.startTime >= newItem.endTime;
    //     }
    //     return false
    //   });
    // }
    const newItems = [newItem, ...existingItems];
    replaceItems(newItems);
  });

  useEffect(() => {
    if (startTime && endTime) {
      setValue('duration', undefined);
    }
  });

  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button width="100%">Add Item</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <form onSubmit={onSubmit}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add Schedule Item</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="4" align="flex-start" minW="md">
                  <Field.Root invalid={!!errors.description}>
                    <Field.Label>Description</Field.Label>
                    <Input {...register('description', { required: true })} />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  <HStack gap="4" align="flex-start" minW="md">
                    <Field.Root invalid={!!errors.startTime}>
                      <Field.Label>Start Time</Field.Label>
                      <Input
                        {...register('startTime', {
                          pattern: {
                            value: /\d\d:\d\d/,
                            message: 'Format hh:mm',
                          },
                        })}
                        placeholder="format hh:mm"
                      />
                      <Field.ErrorText>
                        {errors.startTime?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.endTime}>
                      <Field.Label>End Time</Field.Label>
                      <Input
                        {...register('endTime', {
                          pattern: {
                            value: /\d\d:\d\d/,
                            message: 'Format hh:mm',
                          },
                        })}
                        placeholder="format hh:mm"
                      />
                      <Field.ErrorText>
                        {errors.endTime?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </HStack>
                  <Field.Root
                    invalid={!!errors.duration}
                    disabled={!!startTime && !!endTime}
                  >
                    <Field.Label>Duration (in minutes)</Field.Label>
                    <Input
                      type="number"
                      {...register('duration', {
                        valueAsNumber: true,
                      })}
                    />
                    <Field.ErrorText>
                      {errors.duration?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  <Controller
                    control={control}
                    name="isTask"
                    render={({ field }) => (
                      <Field.Root>
                        <Checkbox.Root
                          checked={field.value}
                          onCheckedChange={({ checked }) =>
                            field.onChange(checked)
                          }
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                          <Checkbox.Label>Task?</Checkbox.Label>
                        </Checkbox.Root>
                      </Field.Root>
                    )}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </form>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
