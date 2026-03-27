import clsx from 'clsx';

const palette = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function colorIndex(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h + name.charCodeAt(i) * (i + 1)) % palette.length;
  return h;
}

export default function Avatar({
  name,
  className,
  size = 32,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const bg = palette[colorIndex(name)];
  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
        bg,
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
