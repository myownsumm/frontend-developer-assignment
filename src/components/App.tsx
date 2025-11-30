import { useEffect } from "react";
import { useStore } from "jotai";
import { RecipientsManager } from "./recipients/RecipientsManager";
import recipientsData from "../assets/recipientsData.json";
import { runRecipientsPipeline } from "../data-pipeline";

const App = () => {
  const store = useStore();

  useEffect(() => {
    // Execute complete data pipeline: transform → normalize → store
    runRecipientsPipeline(recipientsData, store);
  }, [store]);

  return <RecipientsManager />;
};

export default App;
