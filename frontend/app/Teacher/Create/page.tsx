"use client"
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tag,
  Move,
  Share2,
  Download,
  Trash2,
  Save,
  ChevronDown,
} from "lucide-react";
import TagCard from "./Components/TagCard";
import MoveCard from "./Components/MoveCard";
import ShareCard from "./Components/ShareCard";

const Page = () => {
  const [activeCard, setActiveCard] = useState<null | "tag" | "move" | "share">(null);
  const tagBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="p-6 relative">
      {/* Button Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Left group */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto relative">
          <Button
            ref={tagBtnRef}
            className="bg-[#ede9fe] text-[#7c3aed] hover:bg-[#ddd6fe] w-full md:w-auto"
            type="button"
            onClick={() => setActiveCard(activeCard === "tag" ? null : "tag")}
          >
            <Tag className="w-4 h-4" /> Tag
          </Button>
          {activeCard === "tag" && (
            <div className="absolute left-0 top-14 z-20">
              <TagCard onClose={() => setActiveCard(null)} />
            </div>
          )}
          <Button
            className="bg-[#ede9fe] text-[#7c3aed] hover:bg-[#ddd6fe] w-full md:w-auto"
            type="button"
            onClick={() => setActiveCard(activeCard === "move" ? null : "move")}
          >
            <Move className="w-4 h-4" /> Move
          </Button>
          {activeCard === "move" && (
            <div className="absolute left-0 top-14 z-20">
              <MoveCard onClose={() => setActiveCard(null)} />
            </div>
          )}
          <Button
            className="bg-[#ede9fe] text-[#7c3aed] hover:bg-[#ddd6fe] w-full md:w-auto"
            type="button"
            onClick={() => setActiveCard(activeCard === "share" ? null : "share")}
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
          {activeCard === "share" && (
            <div className="absolute left-0 top-14 z-20">
              <ShareCard onClose={() => setActiveCard(null)} />
            </div>
          )}
        </div>
        {/* Right group */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1 w-full md:w-auto"
            type="button"
          >
            <Download className="w-4 h-4" /> Download{" "}
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="destructive" type="button" className="w-full md:w-auto">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button
            className="bg-[#22c55e] text-white hover:bg-[#16a34a] w-full md:w-auto"
            type="button"
          >
            <Save className="w-4 h-4" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
