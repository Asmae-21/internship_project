"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Folder, Plus, Filter, ChevronDown, Pencil, Trash, MoveRight, Copy, Download, Share2, Check } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";

const folders = [
  { id: 1, name: "Introduction to functions" },
  { id: 2, name: "Introduction to functions" },
  { id: 3, name: "Introduction to functions" },
  { id: 4, name: "Introduction to functions" },
  { id: 5, name: "Introduction to functions" },
  { id: 6, name: "Introduction to functions" },
];

const content = [
  {
    title: "Photosynthesis Quiz",
    updated: "2 Days Ago",
    type: "Quiz",
    access: { label: "Only Me", color: "bg-indigo-100 text-indigo-600" },
    actions: [],
  },
  {
    title: "Intro To Fractions",
    updated: "June 25, 2025",
    type: "Course Presentation",
    access: { label: "Sara (View)", color: "bg-yellow-100 text-yellow-700" },
    actions: [],
  },
  {
    title: "French Vocabulary Cards",
    updated: "June 18, 2025",
    type: "Dialog Cards",
    access: { label: "Ahmed (Edit)", color: "bg-yellow-100 text-yellow-700" },
    actions: [],
  },
  {
    title: "Fractions",
    updated: "May 27, 2025",
    type: "Interactive Book",
    access: { label: "Only Me", color: "bg-indigo-100 text-indigo-600" },
    actions: [],
  },
];

// Custom checkbox component
const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    className={`w-4 h-4 border-2 border-gray-300 rounded cursor-pointer flex items-center justify-center transition-colors ${
      checked ? 'bg-blue-500 border-blue-500' : 'bg-white hover:border-gray-400'
    }`}
    onClick={onChange}
  >
    {checked && <Check className="w-3 h-3 text-white" />}
  </div>
);

// Custom radio button component
const Radio = ({ checked, onChange, name, value, label }: { checked: boolean, onChange: any, name: string, value: string, label: string }) => (
  <label className="inline-flex items-center cursor-pointer select-none gap-2 text-xs">
    <span className="relative flex items-center justify-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer appearance-none h-4 w-4 border-2 border-blue-400 rounded-full transition-all duration-150 checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm"
      />
      <span className="pointer-events-none absolute left-0 top-0 w-4 h-4 flex items-center justify-center">
        <span className="block w-2 h-2 rounded-full bg-white peer-checked:bg-blue-600 peer-checked:shadow peer-checked:scale-100 scale-0 transition-all duration-150"></span>
      </span>
    </span>
    {label}
  </label>
);

export default function LibraryPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("title");
  const [selectedAccess, setSelectedAccess] = useState('All');
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const tagOptions = ["Math", "Grade 6", "Semester 1", "Physics"];

  const filteredContent = content.filter(item => {
    // Access filter
    if (selectedAccess === 'Private' && item.access.label !== 'Only Me') return false;
    if (selectedAccess === 'Shared' && item.access.label === 'Only Me') return false;
    // Type filter
    if (selectedType !== 'All' && item.type !== selectedType) return false;
    // Date range filter
    // Try to parse item.updated as a date (handle both '2 Days Ago' and 'YYYY-MM-DD')
    let itemDate: Date | null = null;
    if (/\d{4}-\d{2}-\d{2}/.test(item.updated)) {
      itemDate = new Date(item.updated);
    } else if (/\d+ Days? Ago/.test(item.updated)) {
      const days = parseInt(item.updated);
      itemDate = new Date();
      itemDate.setDate(itemDate.getDate() - days);
    } else {
      itemDate = new Date(item.updated);
    }
    if (dateFrom && itemDate && itemDate < new Date(dateFrom)) return false;
    if (dateTo && itemDate && itemDate > new Date(dateTo)) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(tags => 
      tags.includes(tag) 
        ? tags.filter(t => t !== tag) 
        : [...tags, tag]
    );
  };

  return (
    <div className="px-8 py-6 w-full">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
        <div className="flex-1">
          <Input placeholder="Search by title, tag, or type..." className="w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Folder
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Content <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Quiz</DropdownMenuItem>
              <DropdownMenuItem>Course Presentation</DropdownMenuItem>
              <DropdownMenuItem>Dialog Cards</DropdownMenuItem>
              <DropdownMenuItem>Interactive Book</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setFilterOpen(true)}>
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:w-[220px] w-[220px] p-2">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 font-sans overflow-y-auto overflow-x-hidden max-h-[90vh] pr-1">
                {/* Access */}
                <div>
                  <div className="font-bold text-xs uppercase mb-1 tracking-widest">Access</div>
                  <div className="flex flex-col gap-0.5">
                    {['All', 'Private', 'Shared'].map(opt => (
                      <Radio
                        key={opt}
                        checked={selectedAccess === opt}
                        onChange={() => setSelectedAccess(opt)}
                        name="access"
                        value={opt}
                        label={opt}
                      />
                    ))}
                  </div>
                </div>
                {/* Type */}
                <div>
                  <div className="font-bold text-xs uppercase mb-1 tracking-widest">Type</div>
                  <div className="flex flex-col gap-0.5">
                    {["All", "Quiz", "Course Presentation", "Dialog Cards", "Interactive Book"].map(type => (
                      <Radio
                        key={type}
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        name="type"
                        value={type}
                        label={type}
                      />
                    ))}
                  </div>
                </div>
                {/* Date Updated */}
                <div>
                  <div className="font-bold text-xs uppercase mb-1 tracking-widest">Date Updated</div>
                  <div className="flex gap-1">
                    <input
                      type="date"
                      className="border rounded px-1 py-0.5 w-full text-xs"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      placeholder="From"
                    />
                    <input
                      type="date"
                      className="border rounded px-1 py-0.5 w-full text-xs"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      placeholder="To"
                    />
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <div className="font-bold text-xs uppercase mb-1 tracking-widest">Tags</div>
                  <div className="flex flex-col gap-0.5">
                    {tagOptions.map(tag => (
                      <label key={tag} className="flex items-center gap-2 text-xs cursor-pointer">
                        <Checkbox
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-fit px-1 py-0.5 text-xs mt-1 text-blue-600">+ Add tag</Button>
                </div>
                {/* Sort By */}
                <div>
                  <div className="font-bold text-xs uppercase mb-1 tracking-widest">Sort By</div>
                  <div className="flex flex-col gap-0.5">
                    {[{label: "Title A-Z", value: "title"}, {label: "Type", value: "type"}, {label: "Owner", value: "owner"}].map(opt => (
                      <Radio
                        key={opt.value}
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value)}
                        name="sortBy"
                        value={opt.value}
                        label={opt.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <SheetClose asChild>
                <Button className="mt-6 w-full" variant="outline">Close</Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Folders */}
      <div className="mb-8">
        <div className="font-semibold mb-2">Folders</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center bg-white border rounded-md px-4 py-3 shadow-sm gap-3 w-full mb-4">
              <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="font-medium flex-1 text-sm whitespace-normal break-words" title={folder.name}>{folder.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="w-4 h-4 mr-2" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MoveRight className="w-4 h-4 mr-2" />
                    Move
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="absolute inset-0" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>Folder 1</DropdownMenuItem>
                        <DropdownMenuItem>Folder 2</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Content Table */}
      <div>
        <div className="font-semibold mb-2">Content</div>
        <div className="bg-white rounded-md shadow-sm min-w-[900px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-semibold">Title</th>
                <th className="py-3 px-4 text-left font-semibold">Last Updated</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Access</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-3 px-4 font-semibold whitespace-nowrap">{item.title}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.updated}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.type}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.access.color}`}>{item.access.label}</span>
                  </td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="absolute inset-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem>PDF</DropdownMenuItem>
                              <DropdownMenuItem>CSV</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MoveRight className="w-4 h-4 mr-2" />
                          Move
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="absolute inset-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem>Folder 1</DropdownMenuItem>
                              <DropdownMenuItem>Folder 2</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}