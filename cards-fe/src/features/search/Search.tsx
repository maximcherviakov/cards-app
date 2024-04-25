import { useSearchParams } from "react-router-dom";
import SearchPage from "./SearchPage";
import SearchResults from "./SearchResults";

export default function Search() {
  const [searchQuery] = useSearchParams();

  return !searchQuery.has("q") ? <SearchPage /> : <SearchResults />;
}
