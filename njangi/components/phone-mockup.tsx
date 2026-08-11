import { Bell, Check, Clock } from 'lucide-react'
import { NjangiLogo } from './njangi-logo'

const members = [
  { name: 'Aïcha', status: 'paid' as const, initials: 'A' },
  { name: 'Emmanuel', status: 'paid' as const, initials: 'E' },
  { name: 'Ngono', status: 'late' as const, initials: 'N' },
  { name: 'Fabrice', status: 'paid' as const, initials: 'F' },
]

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[268px] sm:w-[300px]">
      {/* floating notification */}
      <div className="absolute -left-10 top-[52%] z-20 hidden items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
          <Bell className="size-4" />
        </span>
        <span className="text-xs font-medium text-foreground">Aïcha a déposé sa part</span>
      </div>

      <div className="relative rounded-[2.5rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-2xl">
        <div className="overflow-hidden rounded-[1.9rem] bg-background">
          {/* status bar */}
          <div className="flex items-center justify-between bg-primary px-5 pb-3 pt-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <NjangiLogo className="size-6" />
              <span className="font-display text-sm font-semibold">Tontine Famille</span>
            </div>
            <span className="text-[10px] opacity-80">Sept.</span>
          </div>

          {/* pot summary */}
          <div className="bg-primary px-5 pb-5 text-primary-foreground">
            <p className="text-[11px] uppercase tracking-wide opacity-80">Cagnotte du tour</p>
            <p className="font-display text-2xl font-bold">150 000 FCFA</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-3/4 rounded-full bg-mint" />
            </div>
            <p className="mt-1.5 text-[11px] opacity-85">3 membres sur 4 ont payé</p>
          </div>

          {/* members list */}
          <div className="space-y-2 px-4 py-4">
            {members.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 font-display text-xs font-bold text-accent">
                    {m.initials}
                  </span>
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                </div>
                {m.status === 'paid' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-1 text-[11px] font-semibold text-success">
                    <Check className="size-3" /> Payé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2 py-1 text-[11px] font-semibold text-accent">
                    <Clock className="size-3" /> En retard
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
