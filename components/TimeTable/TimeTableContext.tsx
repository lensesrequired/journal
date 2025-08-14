import { apiFetch } from '@/helpers/fetch';
import { Schedule, ScheduleItem, TimeTableType } from '@/types';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type TimeTableContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  items: ScheduleItem[];
  setItems: (items: ScheduleItem[]) => void;
  loadTimeTable: () => Promise<void>;
};

const Context = createContext<TimeTableContextType | undefined>(undefined);

export const TimeTableProvider = ({
  children,
  type,
  id,
  initialItems,
}: {
  children: ReactNode;
  type: TimeTableType;
  id: string;
  initialItems?: ScheduleItem[];
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ScheduleItem[] | null>(
    initialItems || null,
  );

  const loadTimeTable = useCallback(async () => {
    setIsLoading(true);
    apiFetch(`/api/${type}/${id}`, {}).then((response) => {
      if (response.ok) {
        setItems(response.data.items);
        setError(null);
      } else {
        setError(response.error || 'Something went wrong. Please try again.');
      }
      setIsLoading(false);
    });
  }, [type, id]);

  useEffect(() => {
    if (!items) {
      loadTimeTable();
    }
  }, [items, loadTimeTable]);

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
        items: items || [],
        setItems,
        loadTimeTable,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTimeTableContext = (): TimeTableContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'useTimeTableContext must be used within a TimeTableProvider',
    );
  }
  return context;
};
