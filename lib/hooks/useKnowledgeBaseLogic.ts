'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { FAQ, FAQsWithCategory } from '@/types/knowledgeBase';
import { useKnowledgeBase } from './useKnowedgeBase';

export const useKnowledgeBaseLogic = (searchTerm: string) => {
  const {
    faqsWithCategories: categories = [],
    isLoading,
    isError,
    error,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch,
  } = useKnowledgeBase(searchTerm);

  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newFaqCategory, setNewFaqCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);


   const filteredCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      faqs: category.faqs.filter((faq) =>
        [faq.question, faq.answer].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    }));
  }, [categories, searchTerm]);


  const startNewFaq = (categoryId: string) => {
    setNewFaqCategory(categoryId);
    setEditedQuestion('');
    setEditedAnswer('');
  };

  const cancelNewFaq = () => {
    setNewFaqCategory(null);
  };

  const saveNewFaq = async () => {
    if (!newFaqCategory || !editedQuestion.trim() || !editedAnswer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      await createFAQ({ category: newFaqCategory, question: editedQuestion, answer: editedAnswer }).unwrap();
      toast.success('FAQ added');
      cancelNewFaq();
      refetch(); // force UI sync
    } catch {
      toast.error('Failed to add FAQ');
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingFaq(faq.id);
    setEditedQuestion(faq.question);
    setEditedAnswer(faq.answer);
  };

  const cancelEdit = () => setEditingFaq(null);

  const saveEdit = async (faqId: string, categoryId: string) => {
    if (!editedQuestion.trim() || !editedAnswer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      await updateFAQ({ id: faqId, question: editedQuestion, answer: editedAnswer, category: categoryId }).unwrap();
      toast.success('FAQ updated');
      cancelEdit();
      refetch();
    } catch {
      toast.error('Failed to update FAQ');
    }
  };

  const startEditCategory = (category: FAQsWithCategory) => {
    setEditingCategory(category.id);
    setEditedCategoryName(category.name);
  };

  const cancelEditCategory = () => setEditingCategory(null);

  const saveEditCategory = async (categoryId: string) => {
    if (!editedCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await updateCategory({ id: categoryId, name: editedCategoryName }).unwrap();
      toast.success('Category updated');
      cancelEditCategory();
      refetch();
    } catch {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await deleteFAQ(faqId).unwrap();
      toast.success('FAQ deleted');
      refetch();
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory({ id: categoryId }).unwrap();
      toast.success('Category deleted');
      refetch();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }



    try {
    await createCategory({ name: newCategoryName }).unwrap();
      toast.success('Category created');
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      refetch();
    } catch {
      toast.error('Failed to create category');
    }
  };

  return {
    // Data
    filteredCategories,
    isLoading,
    isError,
    error,

    // States
    editingFaq,
    editingCategory,
    newFaqCategory,
    newCategoryName,
    editedQuestion,
    editedAnswer,
    editedCategoryName,
    showNewCategoryInput,

    // Setters
    setNewCategoryName,
    setShowNewCategoryInput,
    setEditedQuestion,
    setEditedAnswer,
    setEditedCategoryName,

    // Actions
    startNewFaq,
    cancelNewFaq,
    saveNewFaq,
    startEdit,
    cancelEdit,
    saveEdit,
    startEditCategory,
    cancelEditCategory,
    saveEditCategory,
    handleDeleteFaq,
    handleDeleteCategory,
    handleAddCategory,
  };
};
