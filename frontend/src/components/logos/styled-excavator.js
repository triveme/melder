import * as React from 'react';
import { SvgIcon as MuiSvgIcon, styled } from '@mui/material';

const SvgIcon = styled(MuiSvgIcon, {
    name: 'excavator',
    shouldForwardProp: (prop) => prop !== 'fill',
})(() => ({
    fill: 'currentColor',
}));

SvgIcon.defaultProps = {
    viewBox: '0 0 24 24',
    focusable: 'false',
    'aria-hidden': 'true',
};

const Excavator = (props) => {
    return (
        <SvgIcon {...props}>
            <path d="M18.5 18.5c.54 0 1 .46 1 1s-.46 1-1 1h-12c-.54 0-1-.46-1-1s.46-1 1-1h12m0-1.5h-12C5.13 17 4 18.13 4 19.5S5.13 22 6.5 22h12a2.5 2.5 0 0 0 0-5m2.5-6h-3V7h-5l-3 4v5h12l-1-5m-9.46 0l1.96-2.5H16V11h-4.46M9.76 3.41L4.76 2L2 11.83c-.34 1.28.41 2.61 1.7 2.97l1.16.32l3.29-2.83l-3.88-1.08l1.88-6.75l2.79.78c.56.29 1.77 1.1 2.53 2.13L12.5 6h.44c-1.26-1.59-3.09-2.54-3.18-2.59Z" />
        </SvgIcon>
        );
};

export default Excavator;