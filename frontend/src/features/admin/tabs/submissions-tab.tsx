// features/admin/tabs/SubmissionsTab.tsx
import { Badge } from "@/components/ui/badge";
import { ADMIN_SUBMISSIONS } from "../data/dummy-admin-data";

const STATUS_STYLE: Record<string, string> = {
  Accepted: "border-green-500/20  bg-green-500/10  text-green-700",
  "Wrong Answer": "border-red-500/20    bg-red-500/10    text-red-700",
  TLE: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
  "Compile Error": "border-orange-500/20 bg-orange-500/10 text-orange-700",
  "Runtime Error": "border-red-500/20    bg-red-500/10    text-red-700",
};

export function SubmissionsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Submissions</h2>
        <p className="text-muted-foreground text-sm">
          {ADMIN_SUBMISSIONS.length} recent submissions
        </p>
      </div>

      <div className="border-border overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-border border-b">
              <tr>
                {["#", "User", "Problem", "Language", "Status", "Runtime", "Memory", "When"].map(
                  (h) => (
                    <th key={h} className="text-muted-foreground p-3 text-left text-xs font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {ADMIN_SUBMISSIONS.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-muted-foreground p-3 text-xs">{s.id}</td>
                  <td className="p-3 text-xs font-medium">{s.user}</td>
                  <td className="p-3 text-xs">{s.problem}</td>
                  <td className="text-muted-foreground p-3 text-xs">{s.language}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLE[s.status]}`}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground p-3 text-xs">{s.runtime}</td>
                  <td className="text-muted-foreground p-3 text-xs">{s.memory}</td>
                  <td className="text-muted-foreground p-3 text-xs">{s.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
