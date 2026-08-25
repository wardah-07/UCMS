type StampProps = {
  label: string;
  className?: string;
};

// A small rotated ink-stamp mark, styled after the rubber stamps used to
// certify a club charter or roster sheet. Reserved for statuses that are
// actually *granted* to someone (a role, manager standing on a club) —
// not a decorative badge for arbitrary text.
export function Stamp({ label, className = "" }: StampProps) {
  return (
    <span
      className={`inline-flex -rotate-3 items-center rounded-sm border-[1.5px] border-stamp/70 bg-stamp/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-stamp uppercase mix-blend-multiply ${className}`}
    >
      {label}
    </span>
  );
}
