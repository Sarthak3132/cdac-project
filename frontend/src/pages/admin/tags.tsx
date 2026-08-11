import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { api } from "@/services/axios-interceptor";

import type { Tag } from "@/features/admin/components/tag/types";
import { CreateTagDialog } from "@/features/admin/components/tag/tag-create";
import { UpdateTagDialog } from "@/features/admin/components/tag/tag-update";
import { DeleteTagDialog } from "@/features/admin/components/tag/tag-delete";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const fetchTags = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/tags");

      const data: Tag[] = res.data.data ?? [];

      setTags(
        [...data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const filteredTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTags.length / pageSize)
  );

  const paginatedTags = filteredTags.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Tags
          </h1>

          <p className="text-muted-foreground text-sm">
            Manage problem tags.
          </p>
        </div>

        <CreateTagDialog onCreated={fetchTags} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search tags..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedTags.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-8 text-center text-muted-foreground"
                >
                  No tags found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    {tag.name}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <UpdateTagDialog
                        tag={tag}
                        onUpdated={fetchTags}
                      />

                      <DeleteTagDialog
                        tagId={tag.id}
                        tagName={tag.name}
                        onDeleted={fetchTags}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total Tags: {filteredTags.length}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Tags;