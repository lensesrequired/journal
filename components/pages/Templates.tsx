'use client';

import { TimeTable } from '@/components/TimeTable';
import { TimeTableProvider } from '@/components/TimeTable/TimeTableContext';
import { TemplateModal } from '@/components/templates/TemplateModal';
import { apiFetch } from '@/helpers/fetch';
import { Schedule, TimeTableType } from '@/types';
import { HStack, Heading, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

export const Templates = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [templates, setTemplates] = useState<Record<string, Schedule>>();

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    apiFetch('/api/templates', {}).then((response) => {
      if (response.ok) {
        setTemplates(response.data.templates);
      } else {
        // TODO: growl error
        // setError(response.error || 'Something went wrong. Please try again.');
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!templates) {
      loadTemplates();
    }
  }, [loadTemplates, templates]);

  return (
    <Stack p={3} display="grid" gridTemplateRows="auto 1fr">
      <HStack justifyContent="space-between" alignItems="end">
        <Heading as="h1" size="4xl">
          Templates
        </Heading>
        <TemplateModal reloadTemplates={loadTemplates} />
      </HStack>
      <HStack
        gap={3}
        overflowX="auto"
        whiteSpace="nowrap"
        flex={1}
        alignItems="start"
      >
        {!isLoading &&
          Object.entries(templates || {}).map(([id, { items }]) => (
            <TimeTableProvider
              key={id}
              type={TimeTableType.TEMPLATE}
              id={id}
              initialItems={items}
            >
              <Stack minWidth={'400px'} flex={1}>
                <Heading as="h5" size="lg">
                  {id}
                </Heading>
                <TimeTable type={TimeTableType.TEMPLATE} id={id} />
              </Stack>
            </TimeTableProvider>
          ))}
        {isLoading && 'Loading...'}
      </HStack>
    </Stack>
  );
};
