import { Grid, Box } from "@chakra-ui/react";
import { AvailableRecipientsPanel } from "./available/AvailableRecipientsPanel";
import { SelectedRecipientsPanel } from "./selected/SelectedRecipientsPanel";

export const RecipientsManager = () => {
  return (
    <Box minH="100vh" bg="gray.50" p={6}>
      <Grid templateColumns="1fr 1fr" gap={6}>
        <AvailableRecipientsPanel />
        <SelectedRecipientsPanel />
      </Grid>
    </Box>
  );
};

