"use client";

import { Button } from "@peja/ui/components/Button";
import { Link } from "@/i18n/navigation";

type CustomizerErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const CustomizerError = ({ error, reset }: CustomizerErrorProps) => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6">
      <div className="rounded-20 border-border bg-card flex max-w-md flex-col gap-3 border p-6 text-center">
        <h2 className="type-h3 font-semibold">Something broke</h2>
        <p className="type-body-small text-muted-foreground leading-relaxed">
          {error.message || "Could not load this product."}
        </p>
        <div className="mt-2 flex justify-center gap-2">
          <Button onClick={reset} className="rounded-full">
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/app/keepsakes">Back to keepsakes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizerError;
