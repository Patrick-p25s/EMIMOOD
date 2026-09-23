import React, { useState } from "react";
import { useFolder } from "@/hooks/useFolder";
import DocumentCard from "@/components/shared/DocumentCard";
import FolderDocumentsView from "@/components/special/FolderDocumentsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, FolderArchive } from "lucide-react";
import FolderFormModal from "@/components/special/FolderFormModal";
import FolderCard from "@/components/special/FolderCard";
import MoveToFolderDialog from "@/components/special/MoveToFolderModal";
import { useMyDocuments } from "@/hooks/useMyDocs";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import AlertBox from "@/components/shared/AlertBox";
import { EmptyCard } from "@/components/shared/EmptyCard";

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
  // Incrémenté à chaque déplacement réussi pour forcer FolderDocumentsView
  // à se remonter (donc à refetch), via la prop `key`
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

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Dossiers</h2>
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
        <h2 className="text-sm font-medium text-muted-foreground">
          Sans dossier
        </h2>
        {documentsSansDossier.length === 0 ? (
          <EmptyCard
            icon={FileText}
            description="Tous tes documents sont déjà classés."
          />
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
        onMoved={handleDocumentMoved} // corrigé (avant : () => {})
      />
    </div>
  );
}
