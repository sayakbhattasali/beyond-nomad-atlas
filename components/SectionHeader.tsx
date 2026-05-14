import { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-4 text-lg font-bold uppercase tracking-[0.4em] text-ember md:text-xl">{eyebrow}</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">{description}</p>}
      </div>
      {action}
    </div>
  );
}
