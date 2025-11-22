import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function Footer() {
  return (
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            height: '9vh',
            backgroundColor: '#F6C2FF',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
            <Container >
                <Typography variant="body1" color="text.secondary">
                    {'Copyright © '}
                    {new Date().getFullYear()}
                </Typography>
            </Container>
        </Box>

  );
}