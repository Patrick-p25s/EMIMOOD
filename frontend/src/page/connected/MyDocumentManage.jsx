import React, { useState } from "react";
import { useFolder } from "@/hooks/useFolder";
import DocumentCard from "@/components/shared/DocumentCard";
import FolderDocumentsView from "@/components/special/FolderDocumentsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText } from "lucide-react";
import FolderFormModal from "@/components/special/FolderFormModal";
import FolderCard from "@/components/special/FolderCard";
import MoveToFolderDialog from "@/components/special/MoveToFolderModal";
import { useMyDocuments } from "@/hooks/useMyDocs";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
export default function MyDocumentManage() {
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
    add: addFolder,
    remove: removeFolder,
    update: updateFolder,
    refresh,
  } = useFolder();

  const { documents } = useMyDocuments();

  const documentsSansDossier = documents.filter((doc) => !doc.folder_id);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const [openFolderForm, setOpenFolderForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  const [documentToMove, setDocumentToMove] = useState(null);
  const [openMove, setOpenMove] = useState(false);

  const handleDeleteFolder = async (folderId) => {
    if (
      !window.confirm(
        "Supprimer ce dossier ? Les documents à l'intérieur ne seront pas supprimés.",
      )
    )
      return;
    await removeFolder(folderId);
  };

  const openMoveDialog = (document) => {
    setDocumentToMove(document);
    setOpenMove(true);
  };

  if (selectedFolder) {
    return (
      <>
        <FolderDocumentsView
          folder={selectedFolder}
          onBack={() => setSelectedFolder(null)}
          cardProps={{ onMove: () => openMoveDialog }}
        />
        <MoveToFolderDialog
          open={openMove}
          onOpenChange={setOpenMove}
          document={documentToMove}
          folders={folders}
          onMoved={() => setSelectedFolder({ ...selectedFolder })}
        />
      </>
    );
  }

  // Vue racine : dossiers + documents sans dossier
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mes documents</h1>
        <ButtonStyled
          className="gap-1.5"
          onClick={() => {
            setEditingFolder(null);
            setOpenFolderForm(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Nouveau dossier
        </ButtonStyled>
      </div>

      {/* Dossiers */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Dossiers</h2>
        {foldersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : foldersError ? (
          <p className="text-sm text-destructive">
            Erreur : {foldersError.message}
          </p>
        ) : folders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun dossier pour l'instant.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onOpen={setSelectedFolder}
                onEdit={(f) => {
                  setEditingFolder(f);
                  setOpenFolderForm(true);
                }}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Sans dossier
        </h2>
        {documentsSansDossier.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center border border-dashed rounded-xl text-muted-foreground">
            <FileText className="h-7 w-7" />
            <p className="text-sm">Tous tes documents sont déjà classés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentsSansDossier.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onMove={() => openMoveDialog(doc)}
              />
            ))}
          </div>
        )}
      </section>

      <FolderFormModal
        open={openFolderForm}
        onOpenChange={setOpenFolderForm}
        onCreate={addFolder}
        onUpdate={updateFolder}
        folder={editingFolder}
      />

      <MoveToFolderDialog
        open={openMove}
        onOpenChange={setOpenMove}
        document={documentToMove}
        folders={folders}
        onMoved={() => {}}
      />
    </div>
  );
}
