"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@peja/icons/ChevronDownIcon";
import { cn } from "@peja/ui/utils/cn";

type HelpFaqItemProps = {
  question: string;
  answer: string;
};

export const HelpFaqItem = ({ question, answer }: HelpFaqItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-border bg-card rounded-16 border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="type-body-small font-semibold">{question}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={cn(
            "text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-border type-body-small text-muted-foreground border-t px-5 py-4 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};
