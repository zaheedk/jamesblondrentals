import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface WellingtonBreadcrumbProps {
  currentLabel: string;
  currentPath?: string;
  isHub?: boolean;
}

const WellingtonBreadcrumb: React.FC<WellingtonBreadcrumbProps> = ({ 
  currentLabel, 
  isHub = false 
}) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <ChevronRight className="h-4 w-4" />
        </li>
        {isHub ? (
          <li aria-current="page">
            <span className="font-medium text-foreground">{currentLabel}</span>
          </li>
        ) : (
          <>
            <li>
              <Link 
                to="/car-rental-wellington-new-zealand" 
                className="hover:text-primary transition-colors"
              >
                Wellington
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page">
              <span className="font-medium text-foreground">{currentLabel}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default WellingtonBreadcrumb;
