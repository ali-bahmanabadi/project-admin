import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    open: boolean;
    handleClose: () => void;
    handleCloseNavigate: () => void;
    title: string;
    description: string;
}

export default function AlertDialog({
    open,
    handleClose,
    handleCloseNavigate,
    title,
    description,
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    خیر
                </Button>
                <Button onClick={handleCloseNavigate}>بله</Button>
            </DialogActions>
        </Dialog>
    );
}
