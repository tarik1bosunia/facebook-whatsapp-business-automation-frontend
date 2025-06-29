
import KnowledgeBase from "@/features/knowledge/KnowledgeBase";

const Knowledge = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Manage your business FAQs and knowledge base content
        </p>
      </div>
      
      <KnowledgeBase />
    </div>
  );
};

export default Knowledge;
