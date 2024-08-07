"use client";

import MyStudio from "@/components/my-studio";
import { useTheme } from "@/context/theme-provider";
import IframeDriver from "@/drivers/iframe-driver";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function EmbedPageClient() {
  const searchParams = useSearchParams();
  const driver = useMemo(() => new IframeDriver(), []);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = (event: any) => {
      if (event.data.type === "setTheme") {
        if (event.data.data === "dark" && theme !== "dark") {
          toggleTheme();
        } else if (event.data.data === "light" && theme !== "light") {
          toggleTheme();
        }
      } else if (event.data.type === "setThemeProperties") {
        for (const [key, value] of event.data.data) {
          window.document.body.style.setProperty(key, value);
        }
      }
    };

    window.addEventListener("message", handler);

    window.parent.postMessage(
      {
        type: "ready",
      },
      "*"
    );

    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    return driver.listen();
  }, [driver]);

  return (
    <MyStudio
      driver={driver}
      color={searchParams.get("color") || "gray"}
      name={searchParams.get("name") || "Unnamed Connection"}
      hideGoBackButton={true}
    />
  );
}
