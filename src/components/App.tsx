import { useEffect, useState } from "react";
import { useStore, useAtomValue } from "jotai";
import { RecipientsManager } from "./recipients/RecipientsManager";
import { LoadingState } from "./states/LoadingState";
import { ErrorState } from "./states/ErrorState";
import { EmptyState } from "./states/EmptyState";
import recipientsData from "../assets/recipientsData.json";
import { runRecipientsPipeline } from "../data-pipeline";
import { recipientsByIdAtom } from "../store/atoms";

const App = () => {
  const store = useStore();
  const recipientsById = useAtomValue(recipientsByIdAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Execute complete data pipeline: transform → normalize → store
    try {
      setIsLoading(true);
      setError(null);
      runRecipientsPipeline(recipientsData, store);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to process recipients data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (Object.keys(recipientsById).length === 0) {
    return <EmptyState />;
  }

  return <RecipientsManager />;
};

export default App;
