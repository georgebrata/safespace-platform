"use client";

import * as React from "react";
import type { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Toast = {
  key: number;
  message: string;
  severity: AlertColor;
  duration?: number;
};

type NotifyOptions = {
  duration?: number;
};

type NotifyApi = {
  success: (message: string, options?: NotifyOptions) => void;
  info: (message: string, options?: NotifyOptions) => void;
  warning: (message: string, options?: NotifyOptions) => void;
  error: (message: string, options?: NotifyOptions) => void;
};

const SnackbarContext = React.createContext<NotifyApi | null>(null);

export function AppSnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackPack, setSnackPack] = React.useState<Toast[]>([]);
  const [messageInfo, setMessageInfo] = React.useState<Toast | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  // Ensure enqueue always creates a COMPLETE Toast (key/message/severity are required)
  const enqueue = React.useCallback(
    (severity: AlertColor, message: string, options?: { duration?: number }) => {
      setSnackPack((prev) => [
        ...prev,
        {
          key: Date.now(), // or Date.now() + Math.random() for extra uniqueness
          message,
          severity,
          duration: options?.duration
        }
      ]);
    },
    []
  );

  const api = React.useMemo<NotifyApi>(
    () => ({
      success: (m, o) => enqueue("success", m, o),
      info: (m, o) => enqueue("info", m, o),
      warning: (m, o) => enqueue("warning", m, o),
      error: (m, o) => enqueue("error", m, o)
    }),
    [enqueue]
  );

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      const [next, ...rest] = snackPack; // next is Toast, not possibly-undefined
      setMessageInfo(next);
      setSnackPack(rest);
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <SnackbarContext.Provider value={api}>
      {children}

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={messageInfo?.duration ?? 2500}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {messageInfo ? (
          <Alert onClose={handleClose} severity={messageInfo.severity} variant="filled">
            {messageInfo.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useNotify(): NotifyApi {
  const ctx = React.useContext(SnackbarContext);
  if (!ctx) throw new Error("useNotify must be used within AppSnackbarProvider");
  return ctx;
}