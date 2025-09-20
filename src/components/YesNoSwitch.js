import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// iOS-style switch component
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#008080',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', { backgroundColor: '#2ECA45' }),
      },
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', { color: theme.palette.grey[600] }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', { opacity: 0.3 }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', { backgroundColor: '#39393D' }),
  },
}));

/**
 * YesNoSwitch
 * 
 * @param {boolean} checked - current switch state
 * @param {function} onChange - handler(newChecked)
 * @param {boolean} disabled - optional
 */
export default function YesNoSwitch({ checked, onChange, disabled = false }) {
  const handleSwitchChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2">Inactive</Typography>
      <IOSSwitch
        checked={checked}
        onChange={handleSwitchChange}
        disabled={disabled}
        inputProps={{ 'aria-label': 'yes-no switch' }}
      />
      <Typography variant="body2">Active</Typography>
    </Stack>
  );
}
