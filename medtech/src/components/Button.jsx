import React from "react";

import Button from '@material-ui/core/Button';

const CallNowButton = ({ onClick }) => (
  <Button variant="contained" color="primary" onClick={onClick}>
    Call Now
  </Button>
);

export default CallNowButton;