import { router } from 'expo-router';

import { Dialog } from '@/components/ui/Dialog';
import { formatMinutes, mockShape, mockTitle } from '@/lib/mockExam';
import { useStartMock } from '@/state/mock';
import type { MockConfig } from '@/types/exam';

export interface StartMockDialogProps {
  /** The mock to start, or `null` while closed. */
  config: MockConfig | null;
  onCancel: () => void;
}

/** Last check before the clock starts. Confirming starts the run and opens the exam. */
export function StartMockDialog({ config, onCancel }: StartMockDialogProps) {
  const startMock = useStartMock();
  const shape = config ? mockShape(config) : null;

  return (
    <Dialog
      visible={config !== null}
      title={config ? `Start ${mockTitle(config).toLowerCase()}?` : ''}
      message={
        shape
          ? `${shape.items} items in ${formatMinutes(shape.minutes)}. The timer starts right away and doesn't pause.`
          : undefined
      }
      confirmLabel="Start now"
      cancelLabel="Not yet"
      onCancel={onCancel}
      onConfirm={() => {
        // Closing first means a second tap finds no config and can't start a second run.
        if (!config) return;
        onCancel();
        const id = startMock(config);
        router.push({ pathname: '/mock/exam/[id]', params: { id } });
      }}
    />
  );
}
