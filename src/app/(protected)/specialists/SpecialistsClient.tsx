'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { SpecialistInsert, SpecialistRow, SpecialistUpdate } from '@/types/supabase';

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || z.string().url().safeParse(v).success, {
    message: 'Enter a valid URL (include https://)'
  });

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^[+()\-\s\d]{7,}$/.test(v), {
    message: 'Enter a valid phone number'
  });

const specialistSchema = z.object({
  fullname: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: optionalPhone,
  website: optionalUrl,
  about: z.string().trim().max(2000, 'About must be at most 2000 characters'),
  isVerified: z.boolean()
});

type SpecialistFormValues = z.infer<typeof specialistSchema>;

type SpecialistsClientProps = {
  userEmail: string;
  initialSpecialists: SpecialistRow[];
};

type DialogState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; specialist: SpecialistRow };

export const SpecialistsClient = ({ initialSpecialists, userEmail }: SpecialistsClientProps) => {
  const [rows, setRows] = React.useState<SpecialistRow[]>(initialSpecialists);
  const [dialog, setDialog] = React.useState<DialogState>({ type: 'closed' });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const formatCreatedAt = React.useCallback((value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    // Deterministic across server/client (avoids hydration mismatch from locale/timezone).
    return `${d.toISOString().replace('T', ' ').slice(0, 19)}Z`;
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SpecialistFormValues>({
    resolver: zodResolver(specialistSchema),
    defaultValues: { fullname: '', phone: '', website: '', about: '', isVerified: false }
  });

  const openCreate = () => {
    setErrorMessage(null);
    reset({ fullname: '', phone: '', website: '', about: '', isVerified: false });
    setDialog({ type: 'create' });
  };

  const openEdit = (specialist: SpecialistRow) => {
    setErrorMessage(null);
    reset({
      fullname: specialist.fullname ?? '',
      phone: specialist.phone ?? '',
      website: specialist.website ?? '',
      about: specialist.about ?? '',
      isVerified: specialist.isVerified ?? false
    });
    setDialog({ type: 'edit', specialist });
  };

  const closeDialog = () => {
    setDialog({ type: 'closed' });
  };

  const upsertRowInState = (updated: SpecialistRow) => {
    setRows((prev) => {
      const existsIdx = prev.findIndex((p) => p.id === updated.id);
      if (existsIdx === -1) return [updated, ...prev];
      const next = [...prev];
      next[existsIdx] = updated;
      return next;
    });
  };

  const onSubmitCreateOrEdit = async (values: SpecialistFormValues) => {
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const supabase = createBrowserSupabaseClient();

      const toNullable = (v: string) => {
        const trimmed = v.trim();
        return trimmed === '' ? null : trimmed;
      };

      if (dialog.type === 'create') {
        const payload: SpecialistInsert = {
          email: userEmail,
          fullname: values.fullname.trim(),
          phone: toNullable(values.phone),
          website: toNullable(values.website),
          about: toNullable(values.about),
          // Specialists cannot self-verify
          isVerified: false
        };

        const { data, error } = await supabase
          .from('specialists')
          .insert(payload)
          .select('*')
          .single();

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data) {
          upsertRowInState(data);
          setSuccessMessage('Specialist created');
          closeDialog();
        }
        return;
      }

      if (dialog.type === 'edit') {
        const payload: SpecialistUpdate = {
          fullname: values.fullname.trim(),
          phone: toNullable(values.phone),
          website: toNullable(values.website),
          about: toNullable(values.about)
        };

        const { data, error } = await supabase
          .from('specialists')
          .update(payload)
          .eq('id', dialog.specialist.id)
          .select('*')
          .single();

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data) {
          upsertRowInState(data);
          setSuccessMessage('Specialist updated');
          closeDialog();
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Deleting is intentionally omitted for "edit your own profile" behavior.

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          My specialist profile
        </Typography>
        {rows.length === 0 ? (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Create my profile
          </Button>
        ) : null}
      </Box>

      {errorMessage ? (
        <Alert severity="error" role="alert">
          {errorMessage}
        </Alert>
      ) : null}

      <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Table size="small" aria-label="Specialists table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Full name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Website</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Verified</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary">
                    No specialists yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.fullname ?? '—'}</TableCell>
                <TableCell>{r.email ?? '—'}</TableCell>
                <TableCell>{r.phone ?? '—'}</TableCell>
                <TableCell>
                  {r.website ? (
                    <Typography
                      component="a"
                      href={r.website}
                      target="_blank"
                      rel="noreferrer"
                      variant="body2"
                      sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none' }}
                    >
                      {r.website}
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={r.isVerified ? 'Verified' : 'Unverified'}
                    size="small"
                    color={r.isVerified ? 'success' : 'default'}
                    variant={r.isVerified ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatCreatedAt(r.created_at)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit specialist">
                    <IconButton
                      aria-label={`Edit ${r.fullname ?? 'specialist'}`}
                      onClick={() => openEdit(r)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialog.type === 'create' || dialog.type === 'edit'}
        onClose={isSaving ? undefined : closeDialog}
        fullWidth
        maxWidth="sm"
        aria-labelledby="specialist-dialog-title"
      >
        <DialogTitle id="specialist-dialog-title">
          {dialog.type === 'edit' ? 'Edit specialist' : 'New specialist'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box
            component="form"
            id="specialist-form"
            onSubmit={handleSubmit(onSubmitCreateOrEdit)}
            sx={{ display: 'grid', gap: 2, mt: 1 }}
          >
            <TextField
              label="Email"
              fullWidth
              disabled
              value={userEmail}
            />
            <TextField
              label="Full name"
              required
              fullWidth
              error={!!errors.fullname}
              helperText={errors.fullname?.message}
              {...register('fullname')}
            />
            <TextField
              label="Phone"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone')}
            />
            <TextField
              label="Website"
              fullWidth
              error={!!errors.website}
              helperText={errors.website?.message}
              {...register('website')}
            />
            <TextField
              label="About"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.about}
              helperText={errors.about?.message}
              {...register('about')}
            />
            <Controller
              name="isVerified"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Verified
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verification is managed by admins.
                    </Typography>
                  </Box>
                  <Chip
                    label={field.value ? 'Verified' : 'Unverified'}
                    size="small"
                    color={field.value ? 'success' : 'default'}
                    variant={field.value ? 'filled' : 'outlined'}
                  />
                </Box>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form="specialist-form" variant="contained" disabled={isSaving}>
            {isSaving ? (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                Saving…
              </Box>
            ) : dialog.type === 'edit' ? (
              'Save changes'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={2500}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};


