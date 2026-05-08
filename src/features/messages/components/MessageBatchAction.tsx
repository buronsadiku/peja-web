type MessageBatchActionProps = {
  label: string;
};

export const MessageBatchAction = ({ label }: MessageBatchActionProps) => (
  <button
    type="button"
    className="type-caption text-background cursor-pointer rounded-full border border-white/25 bg-transparent px-3 py-1.5 font-semibold transition-colors hover:bg-white/10"
  >
    {label}
  </button>
);
