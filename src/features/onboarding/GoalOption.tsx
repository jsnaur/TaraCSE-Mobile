import { OptionRow } from '@/components/ui/OptionRow';

export interface GoalOptionProps {
  count: number;
  title: string;
  caption: string;
  selected: boolean;
  onSelect: () => void;
  showDivider: boolean;
}

/** One radio row in the daily-goal list: name and use on the left, the number on the right. */
export function GoalOption({ count, title, caption, ...rest }: GoalOptionProps) {
  return (
    <OptionRow
      title={title}
      caption={caption}
      figure={String(count)}
      accessibilityLabel={`${title}, ${count} questions a day. ${caption}`}
      {...rest}
    />
  );
}
