import { Grid } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { AvailableRecipientsPanel } from "./available/AvailableRecipientsPanel";
import { SelectedRecipientsPanel } from "./selected/SelectedRecipientsPanel";
import {
  selectedCompanyRecipientsAtom,
  selectedEmailRecipientsAtom,
} from "../../data-pipeline/memoize";

export const RecipientsManager = () => {
  const companyRecipients = useAtomValue(selectedCompanyRecipientsAtom);
  const emailRecipients = useAtomValue(selectedEmailRecipientsAtom);

  return (
    <Grid templateColumns="1fr 1fr" gap={6} p={6}>
      <AvailableRecipientsPanel />
      <SelectedRecipientsPanel
        companyRecipients={companyRecipients}
        emailRecipients={emailRecipients}
      />
    </Grid>
  );
};

