import { useStore, useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { createStore } from "jotai";
import { RecipientsManager } from "./recipients/RecipientsManager";
import { LoadingState } from "./states/LoadingState";
import { ErrorState } from "./states/ErrorState";
import { EmptyState } from "./states/EmptyState";
import recipientsData from "../assets/recipientsData.json";
import { runRecipientsPipeline, type RecipientsData } from "../data-pipeline";
import { recipientsByIdAtom } from "../store/atoms";

/**
 * Query function: Loads and processes recipients data from JSON through the pipeline.
 * Returns the normalized data structure for react-query caching.
 * The pipeline function also stores the data in Jotai atoms as a side effect.
 */
const loadRecipientsData = async (
  store: ReturnType<typeof createStore>
): Promise<RecipientsData> => {
  return new Promise((resolve, reject) => {
    try {
      const normalized = runRecipientsPipeline(recipientsData, store);
      resolve(normalized);
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Failed to process recipients data"));
    }
  });
};

const App = () => {
  const store = useStore();
  const recipientsById = useAtomValue(recipientsByIdAtom);

  const { isLoading, error } = useQuery({
    queryKey: ["recipients"],
    queryFn: () => loadRecipientsData(store),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error instanceof Error ? error : new Error("Failed to load recipients")} />;
  }

  if (Object.keys(recipientsById).length === 0) {
    return <EmptyState />;
  }

  return <RecipientsManager />;
};

export default App;
