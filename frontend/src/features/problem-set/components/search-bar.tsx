import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="search"
        placeholder="Search by problem title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[300px]"
      />

      {searchTerm && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchTerm("")}
        >
          Clear
        </Button>
      )}
    </div>
  );
}