"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, Paper, Typography } from "@mui/material";
import { UploadAvatar } from "./AvatarUpload";

type Props = {
  email: string;
  initialImageUrl?: string | null;
  onFileChange?: (file: File | null) => void;
  title?: string;
  description?: string;
};

export default function ProfilePictureCard({
  email,
  initialImageUrl = null,
  onFileChange,
  title,
  description,
}: Props) {
  const t = useTranslations("profile.picture");

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        minHeight: { xs: 260, sm: 300, lg: 360 },
        display: "grid",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "grid", gap: 0.35 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {resolvedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resolvedDescription}
          </Typography>
        </Box>

        <UploadAvatar
          email={email}
          initialImageUrl={initialImageUrl}
          onFileChange={onFileChange}
        />
      </Box>
    </Paper>
  );
}
