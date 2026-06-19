import type { AdminRole } from "@/lib/cms-types";
import {
  getAdminInitials,
  getAdminRoleTheme,
} from "@/lib/admin-role-ui";

type Props = {
  name: string;
  username: string;
  role: AdminRole;
};

export function AdminUserCard({ name, username, role }: Props) {
  const theme = getAdminRoleTheme(role);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border bg-[#0a0a0a]/80 ${theme.border} ${theme.glow}`}
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-8 select-none font-display text-[5.5rem] leading-none ${theme.wash}`}
        aria-hidden
      >
        {getAdminInitials(name)}
      </div>

      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${theme.bar}`}
        aria-hidden
      />

      <div className="relative px-4 py-4 pl-5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <span
              className={`absolute -inset-1 rounded-full bg-gradient-to-br opacity-40 blur-sm ${theme.bar}`}
              aria-hidden
            />
            <span
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-sm ${theme.avatar} ${theme.ring} ring-2 ring-offset-2 ring-offset-[#0a0a0a]`}
            >
              {getAdminInitials(name)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/35" aria-hidden>
                {theme.icon}
              </span>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.22em] ${theme.roleText}`}
              >
                {theme.label}
              </span>
            </div>
            <p className="mt-1 truncate font-display text-lg leading-tight text-white">
              {name}
            </p>
            <p className="truncate font-mono text-[10px] text-white/40">
              @{username}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${theme.bar}`}
            aria-hidden
          />
          <p className="truncate text-[10px] uppercase tracking-[0.14em] text-white/45">
            {theme.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
