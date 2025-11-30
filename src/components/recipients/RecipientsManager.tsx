import { Grid } from "@chakra-ui/react";
import { AvailableRecipientsPanel } from "./available/AvailableRecipientsPanel";
import { SelectedRecipientsPanel } from "./selected/SelectedRecipientsPanel";

export const RecipientsManager = () => {
  return (
    <Grid templateColumns="1fr 1fr" gap={6} p={6}>
      <AvailableRecipientsPanel />
      <SelectedRecipientsPanel />
    </Grid>
  );
};

