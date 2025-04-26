
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-105",
            selectedCategory === category.id ? "border-4 border-safety-blue" : ""
          )}
          onClick={() => onCategorySelect(category.id)}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span 
              className="material-icons text-5xl mb-2"
              style={{ color: category.color }}
            >
              {category.icon}
            </span>
            <p className="text-center font-medium">{category.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategorySelector;
