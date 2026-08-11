import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/services/axios-interceptor";

import type { Language } from "@/features/admin/components/language/types";
import { CreateLanguageDialog } from "@/features/admin/components/language/language-create";
import { UpdateLanguageDialog } from "@/features/admin/components/language/language-update";
import { DeleteLanguageDialog } from "@/features/admin/components/language/language-delete";

function Languages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLanguages = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/languages");
      setLanguages(res.data.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Languages</h1>
          <p className="text-muted-foreground text-sm">
            Manage supported programming languages.
          </p>
        </div>

        <CreateLanguageDialog onCreated={fetchLanguages} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Extension</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Judge0 ID</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">
                  Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : languages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No languages found.
                </TableCell>
              </TableRow>
            ) : (
              languages.map((language) => (
                <TableRow key={language.id}>
  <TableCell className="font-medium">
    {language.name}
  </TableCell>

  <TableCell>
    {language.shortName}
  </TableCell>

  <TableCell>
    {language.fileExtension}
  </TableCell>

  <TableCell>
    {language.version}
  </TableCell>

  <TableCell>
    {language.judge0LanguageId}
  </TableCell>

  <TableCell>
    <Badge
      variant={
        language.enabled
          ? "default"
          : "destructive"
      }
    >
      {language.enabled ? "Enabled" : "Disabled"}
    </Badge>
  </TableCell>

  <TableCell className="text-right">
    <div className="flex justify-end gap-1">
      <UpdateLanguageDialog
        language={language}
        onUpdated={fetchLanguages}
        trigger={
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />

      <DeleteLanguageDialog
        languageId={language.id}
        languageName={language.name}
        onDeleted={fetchLanguages}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  </TableCell>
</TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Languages;