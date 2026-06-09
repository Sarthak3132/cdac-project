// features/admin/tabs/UsersTab.tsx
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_USERS } from "../data/dummy-admin-data";

export function UsersTab() {
  const [search, setSearch] = useState("");

  const filtered = ADMIN_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Users</h2>
          <p className="text-muted-foreground text-sm">{ADMIN_USERS.length} total users</p>
        </div>
        <Button size="sm" className="h-8 text-xs">
          Add User
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pr-8 pl-9 text-xs"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="border-border overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-border border-b">
              <tr>
                {["#", "Name", "Role", "Solved", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="text-muted-foreground p-3 text-left text-xs font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-muted-foreground p-3 text-xs">{u.id}</td>
                  <td className="p-3">
                    <p className="text-xs font-medium">{u.name}</p>
                    <p className="text-muted-foreground text-xs">{u.email}</p>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs">{u.solved}</td>
                  <td className="text-muted-foreground p-3 text-xs">{u.joinedAt}</td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        u.status === "active"
                          ? "border-green-500/20 bg-green-500/10 text-green-700"
                          : "border-red-500/20 bg-red-500/10 text-red-700"
                      }`}
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
