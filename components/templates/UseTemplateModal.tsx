import { useTimeTableContext } from '@/components/TimeTable/TimeTableContext';
import { apiFetch } from '@/helpers/fetch';
import { ResourceType, Schedule } from '@/types';
import {
  Alert,
  Button,
  CloseButton,
  Combobox,
  Dialog,
  Portal,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const UseTemplateModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Record<string, Schedule>>({});
  const { loadTimeTable, id } = useTimeTableContext();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<{ template: string }>({ mode: 'onChange' });

  const { contains } = useFilter({ sensitivity: 'base' });
  const { collection, filter, set } = useListCollection<string>({
    initialItems: [],
    filter: contains,
  });

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    apiFetch('/api/templates', {}).then((response) => {
      if (response.ok) {
        setTemplates(response.data.templates);
        set(Object.keys(response.data.templates));
      } else {
        setError(response.error || 'Something went wrong. Please try again.');
      }
      setIsLoading(false);
    });
  }, [set]);

  useEffect(() => {
    reset();
    loadTemplates();
  }, [open, loadTemplates, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const resp = await apiFetch(`/api/${ResourceType.SCHEDULE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templates[data.template]),
    });
    if (resp.ok) {
      loadTimeTable();
      setOpen(false);
    } else {
      setError(resp.error || 'Something went wrong. Please try again later.');
    }
  });

  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Dialog.Trigger asChild>
        <Button width="100%">Use Template</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <form onSubmit={onSubmit}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Use Template</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {error && (
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Root>
                )}
                <Controller
                  name="template"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Combobox.Root
                      disabled={isLoading}
                      minWidth="400px"
                      collection={collection}
                      onInputValueChange={(e) => filter(e.inputValue)}
                      value={[field.value]}
                      onValueChange={(e) => {
                        field.onChange(e.value[0]);
                      }}
                      invalid={!!errors.template}
                    >
                      <Combobox.Label>Select template</Combobox.Label>
                      <Combobox.Control>
                        <Combobox.Input placeholder="Type to search" />
                        <Combobox.IndicatorGroup>
                          <Combobox.ClearTrigger />
                          <Combobox.Trigger />
                        </Combobox.IndicatorGroup>
                      </Combobox.Control>
                      <Combobox.Positioner>
                        <Combobox.Content>
                          <Combobox.Empty>No items found</Combobox.Empty>
                          {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item}>
                              {item}
                              <Combobox.ItemIndicator />
                            </Combobox.Item>
                          ))}
                        </Combobox.Content>
                      </Combobox.Positioner>
                    </Combobox.Root>
                  )}
                />
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
