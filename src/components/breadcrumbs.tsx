import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="bg-white p-4 px-5 pt-24 flex items-center flex-wrap">
      <ul className="flex items-center">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            <Link to={breadcrumb.href}
              className={`text-gray-600 hover:text-blue-500 ${
                index === breadcrumbs.length - 1 ? 'text-blue-500' : ''
              }`}
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <svg
                className="w-5 h-auto fill-current mx-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
              </svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
