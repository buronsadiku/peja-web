import { getTranslations } from "next-intl/server";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { Logo } from "@peja/ui/components/Logo";
import { WarningIcon } from "@peja/icons/WarningIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type CheckoutCancelPageProps = {
  params: Promise<{ orderId: string }>;
};

export const CheckoutCancelPage = async ({
  params,
}: CheckoutCancelPageProps) => {
  const { orderId } = await params;
  const t = await getTranslations();

  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-140 flex-col items-center gap-6 px-6 py-12 text-center">
        <div className="rounded-16 bg-muted inline-flex size-16 items-center justify-center">
          <WarningIcon width={28} height={28} className="text-muted-foreground" />
        </div>
        <Kicker className="text-muted-foreground">
          {t("checkout__cancel__eyebrow")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("checkout__cancel__title")}
        </h1>
        <p className="type-body-small text-muted-foreground max-w-md leading-relaxed">
          {t.rich("checkout__cancel__body", {
            id: orderId.slice(0, 8),
            strong: (chunks) => (
              <span className="text-foreground/85 font-mono">{chunks}</span>
            ),
          })}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link href={appRoutes.app.keepsakes}>
              {t("checkout__cancel__back_keepsakes")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={appRoutes.app.root}>{t("checkout__cancel__skip")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};
