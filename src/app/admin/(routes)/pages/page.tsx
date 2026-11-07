import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getPages } from "@/services/page.service";

import { Suspense } from "react";
import { CreatePageDialog } from "./_components/create-page-dialog";
import { PageActions } from "./_components/page-actions";

export default function Pages() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageRenderer />
    </Suspense>
  );
}

async function PageRenderer() {
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Manage your website pages.
          </p>
        </div>

        <CreatePageDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Blocks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>

                  <TableCell className="text-muted-foreground">
                    /{page.slug}
                  </TableCell>

                  <TableCell>{page.content?.content?.length ?? 0}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        page.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {page.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <PageActions
                      page={{
                        id: page.id,
                        title: page.title,
                        slug: page.slug,
                        status: page.status,
                      }}
                    />
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
