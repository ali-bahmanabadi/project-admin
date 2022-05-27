import * as React from 'react';
import { AddCircleOutlineRounded } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './title.scss';

interface Props {
    title: string;
    titleButton?: string;
    titleButtonHref?: string;
}

const Title: React.FC<Props> = ({ title, titleButton, titleButtonHref }) => {
    const navigate = useNavigate();
    return (
        <div className="titleComponent">
            <div className="title">{title}</div>
            {titleButton && titleButtonHref && (
                <Fab
                    variant="extended"
                    color="primary"
                    size="small"
                    onClick={() => navigate(titleButtonHref)}
                >
                    <AddCircleOutlineRounded sx={{ mr: 1 }} />
                    {titleButton}
                </Fab>
            )}
        </div>
    );
};

export default Title;
