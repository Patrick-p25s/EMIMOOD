import React, { useState } from "react";
import { useFolder } from "@/hooks/useFolder";
import DocumentCard from "@/components/features/documents/DocumentCard";
import FolderDocumentsView from "@/components/features/folders/FolderDocumentsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, FolderArchive, FolderOpen } from "lucide-react";
import FolderFormModal from "@/components/features/folders/FolderFormModal";
import FolderCard from "@/components/features/folders/FolderCard";
import MoveToFolderDialog from "@/components/features/folders/MoveToFolderModal";
import { useMyDocuments } from "@/hooks/useMyDocs";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import AlertBox from "@/components/common/feedback/AlertBox";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";

export default function MyDocumentManage() {
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
    add: addFolder,
    remove: removeFolder,
    update: updateFolder,
  } = useFolder();

  const { documents, refresh: refreshMyDocuments } = useMyDocuments();

  const documentsSansDossier = documents.filter((doc) => !doc.folder_id);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const [folderViewKey, setFolderViewKey] = useState(0);

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

  const handleDocumentMoved = () => {
    refreshMyDocuments();
    setFolderViewKey((k) => k + 1);
  };

  if (selectedFolder) {
    return (
      <>
        <FolderDocumentsView
          key={folderViewKey}
          folder={selectedFolder}
          onBack={() => setSelectedFolder(null)}
          cardProps={{ onMove: openMoveDialog }} // corrigé
        />
        <MoveToFolderDialog
          open={openMove}
          onOpenChange={setOpenMove}
          document={documentToMove}
          folders={folders}
          onMoved={handleDocumentMoved} // corrigé
        />
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-8">
      <section className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div><h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Mes documents</h1><p className="mt-1 text-sm text-muted-foreground">Classe tes fichiers et retrouve-les facilement.</p></div>
        <ButtonStyled
          className="gap-1.5 rounded-lg"
          onClick={() => {
            setEditingFolder(null);
            setOpenFolderForm(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Nouveau dossier
        </ButtonStyled>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Dossiers</h2><div className="h-px flex-1 bg-border" /></div>
        {foldersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : foldersError ? (
          <AlertBox variant="error" title="Erreur">
            {foldersError.message}
          </AlertBox>
        ) : folders.length === 0 ? (
          <EmptyCard
            icon={FolderArchive}
            description="Aucune dossier pour le moment"
          />
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
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Documents non classés</h2><div className="h-px flex-1 bg-border" /></div>
        {documentsSansDossier.length === 0 ? (
          <EmptyCard
            icon={FileText}
            description="Tous tes documents sont déjà classés."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentsSansDossier.map((doc) => (
              <DocumentCard
                onRead={null}
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
        onMoved={handleDocumentMoved} // corrigé (avant : () => {})
      />
    </div>
  );
}
