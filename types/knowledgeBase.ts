export interface Category{
  id: string;
  name: string;
  user: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQsWithCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}