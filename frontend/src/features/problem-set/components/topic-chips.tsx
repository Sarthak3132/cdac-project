import { Badge } from "../../../components/ui/badge";

const topics = [
  "Array",
  "String",
  "Hash Table",
  "Tree",
  "Graph",
  "DP",
  "Linked List"
];

export default function TopicChips() {
  return (
    <div className="flex gap-2 flex-wrap">
      {topics.map((topic) => (
        <Badge key={topic} variant="secondary">
          {topic}
        </Badge>
      ))}
    </div>
  );
}