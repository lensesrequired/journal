import { apiFetch } from '@/helpers/fetch';
import { TimeTableType } from '@/types';
import {
  Alert,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  reloadTemplates: () => void;
};

export const TemplateModal = ({ reloadTemplates }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm<{ id: string }>({ mode: 'onBlur' });

  useEffect(() => {
    setValue('id', '');
  }, [open, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const resp = await apiFetch(`/api/${TimeTableType.TEMPLATE}/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({ items: [] }),
    });
    if (resp.ok) {
      reloadTemplates();
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
        <Button>Add Template</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <form onSubmit={onSubmit}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add Template</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {error && (
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Root>
                )}
                <Stack gap="4" align="flex-start" minW="md">
                  <Field.Root invalid={!!errors.id}>
                    <Field.Label>Name</Field.Label>
                    <Input {...register('id', { required: true })} />
                    <Field.ErrorText>{errors.id?.message}</Field.ErrorText>
                  </Field.Root>
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
