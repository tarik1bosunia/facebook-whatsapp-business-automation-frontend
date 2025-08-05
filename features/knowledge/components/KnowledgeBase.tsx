'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Save,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useKnowledgeBaseLogic } from '@/lib/hooks/useKnowledgeBaseLogic';

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const kb = useKnowledgeBaseLogic(searchTerm);

  if (kb.isLoading) return <div>Loading...</div>;
  if (kb.isError) return <div>Error loading FAQs</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => kb.setShowNewCategoryInput(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {kb.showNewCategoryInput && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Category name"
                value={kb.newCategoryName}
                onChange={(e) => kb.setNewCategoryName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={kb.handleAddCategory}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  kb.setShowNewCategoryInput(false);
                  kb.setNewCategoryName('');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {kb.filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No FAQs found matching your search</p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        kb.filteredCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                {kb.editingCategory === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={kb.editedCategoryName}
                      onChange={(e) => kb.setEditedCategoryName(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => kb.saveEditCategory(category.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={kb.cancelEditCategory}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span>{category.name}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => kb.startNewFaq(category.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => kb.startEditCategory(category)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => kb.handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kb.newFaqCategory === category.id && (
                <div className="border rounded-lg p-4 mb-4 bg-primary/5">
                  <Input
                    placeholder="Question"
                    value={kb.editedQuestion}
                    onChange={(e) => kb.setEditedQuestion(e.target.value)}
                    className="mb-3"
                  />
                  <Textarea
                    placeholder="Answer"
                    value={kb.editedAnswer}
                    onChange={(e) => kb.setEditedAnswer(e.target.value)}
                    className="mb-3"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={kb.cancelNewFaq}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={kb.saveNewFaq}>
                      <Save className="h-4 w-4 mr-2" />
                      Save FAQ
                    </Button>
                  </div>
                </div>
              )}

              <Accordion type="multiple" className="w-full">
                {category.faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="hover:no-underline">
                      {kb.editingFaq === faq.id ? (
                        <Input
                          value={kb.editedQuestion}
                          onChange={(e) => kb.setEditedQuestion(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span>{faq.question}</span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {kb.editingFaq === faq.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={kb.editedAnswer}
                            onChange={(e) => kb.setEditedAnswer(e.target.value)}
                            rows={4}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={kb.cancelEdit}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => kb.saveEdit(faq.id, category.id)}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground pb-2">{faq.answer}</p>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button size="sm" variant="ghost" onClick={() => kb.startEdit(faq)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500"
                              onClick={() => kb.handleDeleteFaq(faq.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default KnowledgeBase;
