import { useNavigate, useParams } from "react-router-dom";
import useDocument from "@/hooks/useDocument";
import { DocumentViewerPage } from "@/components/special/DocumentViewer";
export default function OneDocumentModerator() {
  const { documentId } = useParams();
  const { getDocumentById } = useDocument();
  const document = getDocumentById(documentId);
  const navigate = useNavigate();
  return (
    <div>
      <DocumentViewerPage
        document={document}
        onBack={navigate("/moderator/documents")}
      />
    </div>
  );
}
