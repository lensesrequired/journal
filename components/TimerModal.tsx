import {
  Button,
  CloseButton,
  Dialog,
  Link,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type Props = {
  description: string;
  duration: number;
};

export const TimerModal = ({ description, duration }: Props) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return; // stop when it reaches zero

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [running, timeLeft]);

  // Format as HH:MM:SS or MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
  };

  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Link variant="plain" href="#">
          Timer
        </Link>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{description} Timer</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text textStyle="5xl">{formatTime(timeLeft)}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                disabled={running}
                onClick={() => {
                  setRunning(true);
                }}
              >
                Start
              </Button>
              <Button
                variant="surface"
                disabled={!running}
                onClick={() => {
                  setRunning(false);
                }}
              >
                Pause
              </Button>
              <Button
                colorPalette="pink"
                variant="outline"
                onClick={() => {
                  setTimeLeft(duration * 60);
                }}
              >
                Reset
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Close</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
