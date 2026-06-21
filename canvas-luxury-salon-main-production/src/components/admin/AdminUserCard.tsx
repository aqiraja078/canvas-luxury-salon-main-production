type Props = {
  username: string;
};

export function AdminUserCard({ username }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
      <p className="truncate font-mono text-sm text-gold">{username}</p>
    </div>
  );
}
