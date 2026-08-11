// pages/admin/users.tsx
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/services/axios-interceptor";

import { isUserBlocked, type UserManagementResponse } from "@/features/admin/components/user/types";
import { BlockUserDialog } from "@/features/admin/components/user/user-block-dialog";
import { UnblockUserButton } from "@/features/admin/components/user/user-unblock-dialog";
import { DeleteUserDialog } from "@/features/admin/components/user/user-delete-dialog";

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page, 0-indexed
  size: number;
}

const PAGE_SIZE = 10;

function Users() {
  const [users, setUsers] = useState<UserManagementResponse[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/admin/users", {
        params: {
          page,
          size: PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data: PageResponse<UserManagementResponse> = res.data.data;

      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Jump back to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground text-sm">
          Manage platform users, block access, or remove accounts.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const blocked = isUserBlocked(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.userRole}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={blocked ? "destructive" : "secondary"}>
                        {blocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {blocked ? (
                          <UnblockUserButton
                            userId={user.id}
                            username={user.username}
                            onUnblocked={fetchUsers}
                          />
                        ) : (
                          <BlockUserDialog
                            userId={user.id}
                            username={user.username}
                            onBlocked={fetchUsers}
                          />
                        )}
                        <DeleteUserDialog
                          userId={user.id}
                          username={user.username}
                          onDeleted={fetchUsers}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-muted-foreground text-sm">
            Page {page + 1} of {totalPages} ({totalElements} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!canGoPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;