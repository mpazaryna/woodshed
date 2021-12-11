import React from "react";
import TextField from "@material-ui/core/TextField";

export const InputTwo = (ref, error, inputProps) => {
  return (
    <div className="form-group">
      <TextField
        variant="outlined"
        margin="normal"
        inputRef={ref}
        fullWidth
        {...inputProps}
      />
      {error && <div>{error.message}</div>}
    </div>
  );
};
