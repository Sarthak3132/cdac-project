import { useNavigate } from "react-router-dom";

type Problem = {
  id: number;
  title: string;
  level: string;
};

type Props = {
  problems: Problem[];
};

export default function ProblemTable({ problems }: Props) {
  const navigate = useNavigate();

  const getlevelStyle = (level: string) => {
    switch (level) {
      case "Easy":
        return "text-green-600 font-medium";
      case "Medium":
        return "text-yellow-600 font-medium";
      case "Hard":
        return "text-red-600 font-medium";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="w-16 p-3 text-left">#</th>
            <th className="p-3 text-left">Problem Title</th>
            <th className="w-32 p-3 text-left">Level</th>
          </tr>
        </thead>

        <tbody>
          {problems.map((problem) => (
            <tr
              key={problem.id}
              onClick={() => navigate(`/app/problems/${problem.id}`)}
              className="hover:bg-muted/50 cursor-pointer border-t transition-colors"
            >
              <td className="p-3">{problem.id}</td>

              <td className="p-3 font-medium">{problem.title}</td>

              <td className={`p-3 ${getlevelStyle(problem.level)}`}>{problem.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
