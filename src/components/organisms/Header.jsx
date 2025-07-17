import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, searchValue, onSearchChange, title, actions }) => {
  return (
    <header className="bg-surface border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search members..."
              className="w-80"
            />
          </div>
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search members..."
        />
      </div>
    </header>
  );
};

export default Header;