"use client";

import { Button } from "@peja/ui/components/Button";

export const QRCodeMobileBar = () => (
  <div className="border-border bg-card tablet:hidden fixed right-0 bottom-0 left-0 flex gap-2.5 border-t p-4">
    <Button variant="outline" className="rounded-full">
      PNG
    </Button>
    <Button className="shadow-primary/40 flex-1 rounded-full shadow-md">
      Share QR code
    </Button>
  </div>
);
