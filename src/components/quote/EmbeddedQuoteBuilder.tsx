import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, AlertCircle, RefreshCw, X } from "lucide-react";

interface Props {
  open: boolean;
  url: string | null;
  onClose: () => void;
}

/**
 * Embeds the external Quote Builder in an iframe modal (Facebook-embed style).
 * If the provider blocks iframing (X-Frame-Options / CSP), we detect the empty
 * load and offer a one-click fallback to open the same URL in a new tab.
 */
export default function EmbeddedQuoteBuilder({ open, url, onClose }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setBlocked(false);
    // If the iframe never fires `load` within 8s, assume the provider blocks embedding.
    const t = window.setTimeout(() => {
      setBlocked((prev) => (loading ? true : prev));
    }, 8000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reloadKey, url]);

  const openInNewTab = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b p-3 space-y-0">
          <DialogTitle className="text-sm font-semibold">Quote Builder (embedded)</DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setReloadKey((k) => k + 1)} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Reload
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex-1 bg-muted/20">
          {loading && !blocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading Quote Builder…
              </div>
            </div>
          )}

          {blocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-20 p-6">
              <div className="max-w-md text-center space-y-3">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <h3 className="font-semibold">This Quote Builder blocks embedding</h3>
                <p className="text-sm text-muted-foreground">
                  The external site refuses to load inside a frame (X-Frame-Options / CSP).
                  You can still open it in a new tab — the sync back to this SOP will work the same way.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={openInNewTab} className="gap-1.5">
                    <ExternalLink className="h-4 w-4" /> Open in new tab
                  </Button>
                  <Button variant="outline" onClick={() => { setBlocked(false); setReloadKey((k) => k + 1); }}>
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {url && (
            <iframe
              key={reloadKey}
              ref={iframeRef}
              src={url}
              title="Quote Builder"
              className="h-full w-full border-0"
              // Allow common features. Sandbox intentionally omitted so the
              // external app can run scripts, popups, forms, and its own storage.
              allow="clipboard-read; clipboard-write; fullscreen; camera; microphone; geolocation"
              onLoad={() => setLoading(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
