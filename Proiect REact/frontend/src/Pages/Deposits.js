import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

export default function Deposits({ totalBalance }) {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <React.Fragment>
            <Title>Total Balance</Title>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '60%',
                marginTop: '0%'
            }}>
                <Typography component="p" variant="h3" style={{fontSize: '2.5rem'}}>
                    {`$${totalBalance.toFixed(2)}`}
                </Typography>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 'auto'}}>
                <Typography color="text.secondary">
                    on {formattedDate}
                </Typography>
            </div>
        </React.Fragment>
    );
}
