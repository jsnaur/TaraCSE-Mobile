import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/TextField';
import { spacing } from '@/theme/tokens';

const REASONS = ['Incorrect', 'Offensive', 'Confusing', 'Other'] as const;
type Reason = (typeof REASONS)[number];

export interface ReportExplanationProps {
  onBack: () => void;
  /** "Back" when the form came from the explanation, "Cancel" when it opened on its own. */
  backLabel?: string;
  /** Nothing is sent anywhere yet; the prototype only moves to the thank-you state. */
  onSend: (report: { reason: Reason; note: string }) => void;
}

/** Report form for an AI-written explanation (docs/PLAY_STORE.md §3). */
export function ReportExplanation({ onBack, backLabel = 'Back', onSend }: ReportExplanationProps) {
  const [reason, setReason] = useState<Reason | null>(null);
  const [note, setNote] = useState('');

  return (
    <View style={styles.wrap}>
      <AppText variant="body" tone="muted">
        Pick what is off about it. A note helps us fix it faster.
      </AppText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Reason">
        {REASONS.map((r) => (
          <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />
        ))}
      </View>
      <TextField
        label="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={300}
        placeholder="What should it say instead?"
      />
      <View style={styles.actions}>
        <Button label={backLabel} variant="ghost" onPress={onBack} />
        <Button
          label="Send report"
          disabled={reason === null}
          onPress={() => {
            if (reason) onSend({ reason, note: note.trim() });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
});
