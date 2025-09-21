"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Exact data from the image
const contentData = [
  {
    id: 1,
    title: "Photosynthesis Quiz",
    owner: "Amin Boujidi",
    lastUpdated: "2 Days Ago",
    type: "Quiz",
    access: "Private"
  },
  {
    id: 2,
    title: "Intro To Fractions",
    owner: "Mouna Sikal",
    lastUpdated: "June 25, 2025",
    type: "Course Presentation",
    access: "Shared"
  },
  {
    id: 3,
    title: "French Vocabulary Cards",
    owner: "Maria Hostin",
    lastUpdated: "June 18, 2025",
    type: "Dialog Cards",
    access: "Shared"
  },
  {
    id: 4,
    title: "Fractions",
    owner: "Ayoub Boram",
    lastUpdated: "May 27, 2025",
    type: "Interactive Book",
    access: "Private"
  }
];

export default function AdminContentAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSort, setSelectedSort] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Section visibility states
  const [showAccess, setShowAccess] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showDateUpdated, setShowDateUpdated] = useState(false);
  const [showSort, setShowSort] = useState(true);

  // Helper function to convert date picker format to readable format
  const formatDateForComparison = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  // Helper function to check if a relative date matches the selected date
  const checkRelativeDate = (relativeDate: string, selectedDate: string) => {
    if (!selectedDate) return true;
    
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // Calculate the date that "2 Days Ago" would be
    if (relativeDate.includes("Days Ago")) {
      const daysAgo = parseInt(relativeDate.split(" ")[0]);
      const calculatedDate = new Date(today);
      calculatedDate.setDate(today.getDate() - daysAgo);
      
      return calculatedDate.toDateString() === selected.toDateString();
    }
    
    return false;
  };

  // Helper function to check if a date falls within a range
  const isDateInRange = (itemDate: string, startDate: string, endDate: string) => {
    if (!startDate && !endDate) return true;
    
    const today = new Date();
    let itemDateObj: Date;
    
    // Handle relative dates like "2 Days Ago"
    if (itemDate.includes("Days Ago")) {
      const daysAgo = parseInt(itemDate.split(" ")[0]);
      itemDateObj = new Date(today);
      itemDateObj.setDate(today.getDate() - daysAgo);
    } else {
      // Handle absolute dates like "June 25, 2025"
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const parts = itemDate.split(" ");
      const month = months.indexOf(parts[0]);
      const day = parseInt(parts[1].replace(",", ""));
      const year = parseInt(parts[2]);
      
      itemDateObj = new Date(year, month, day);
    }
    
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;
    
    // Check if date is within range
    if (startDateObj && endDateObj) {
      return itemDateObj >= startDateObj && itemDateObj <= endDateObj;
    } else if (startDateObj) {
      return itemDateObj >= startDateObj;
    } else if (endDateObj) {
      return itemDateObj <= endDateObj;
    }
    
    return true;
  };

  // Filter content based on search and filters
  const filteredContent = contentData.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Access filter
    const matchesAccess = selectedAccess === "All" || item.access === selectedAccess;
    
    // Type filter
    const matchesType = selectedType === "All" || item.type === selectedType;
    
    // Date range filter
    const matchesDateRange = isDateInRange(item.lastUpdated, startDate, endDate);
    
    return matchesSearch && matchesAccess && matchesType && matchesDateRange;
  });

  // Sort content based on selected sort option
  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (selectedSort) {
      case "Title A-Z":
        return a.title.localeCompare(b.title);
      case "Type":
        return a.type.localeCompare(b.type);
      case "Owner":
        return a.owner.localeCompare(b.owner);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title, owner, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
        </div>
        
        {/* Filter Button */}
        <Button 
          className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowFilters(false)}
      ></div>
      
      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-300 transform ${
          showFilters ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="font-bold text-black">Filters</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Access Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setShowAccess(!showAccess)}
            >
              <span className="font-medium text-gray-500">Access</span>
              {showAccess ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {showAccess && (
              <div className="space-y-2">
                {["All", "Private", "Shared"].map((access) => (
                  <label key={access} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAccess === access}
                      onChange={() => setSelectedAccess(access)}
                      className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"
                    />
                    <span className="text-black">{access}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Type Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setShowType(!showType)}
            >
              <span className="font-medium text-gray-500">Type</span>
              {showType ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {showType && (
              <div className="space-y-2">
                {["All", "Quiz", "Course Presentation", "Dialog Cards", "Interactive Book"].map((type) => (
                  <label 
                    key={type} 
                    className={`flex items-center gap-3 cursor-pointer p-1 rounded ${
                      selectedType === type ? "bg-gray-100" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"
                    />
                    <span className="text-black">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Updated Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setShowDateUpdated(!showDateUpdated)}
            >
              <span className="font-medium text-gray-500">Date Updated</span>
              {showDateUpdated ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {showDateUpdated && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sort By Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setShowSort(!showSort)}
            >
              <span className="font-medium text-gray-500">Sort By</span>
              {showSort ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {showSort && (
              <div className="space-y-2">
                {["Title A-Z", "Type", "Owner"].map((sort) => (
                  <label key={sort} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSort === sort}
                      onChange={() => setSelectedSort(sort)}
                      className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"
                    />
                    <span className="text-black">{sort}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Apply Filters Button */}
          <Button 
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-700 underline decoration-blue-300 cursor-pointer">
                      {item.owner}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {item.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.access === "Private" ? "bg-slate-100 text-blue-600" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {sortedContent.length} of {contentData.length} content items
      </div>
    </div>
  );
}