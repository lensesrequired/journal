import { Button } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';

export const RemoveItemDroppable = ({}) => {
  const { setNodeRef } = useDroppable({
    id: 'remove-item',
  });

  return (
    <Button ref={setNodeRef} width="100%" colorPalette="red" variant="surface">
      Delete Item
    </Button>
  );
};
