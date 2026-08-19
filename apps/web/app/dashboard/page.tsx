"use client";

import { Plus } from "lucide-react";
import Button from "../../components/Button";
import RoomCanvas from "../../components/game/RoomCanvas";

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-82px)] w-full ">
      <div className="w-full flex items-center justify-between gap-3 px-8 my-2">
        <div className="text-2xl font-semibold tracking-tight">Create your space</div>
        <Button
          type="submit"
          onClick={() => {}}
          children="Create a space"
          icon={<Plus size={18} />}
        />
      </div>
      <div>
        <RoomCanvas/>
      </div>
    </div>
  );
}
