"use client";

import { Stage, Layer, Rect, Circle, Text, Group } from "react-konva";

export default function RoomCanvas() {
  return (
    <Stage width={1000} height={700}>
      <Layer>
        {/* Room floor */}
        <Rect
          x={50}
          y={50}
          width={900}
          height={600}
          fill="#e8e1d5"
          stroke="#333"
          strokeWidth={4}
        />

        {/* Table */}
        <Group x={350} y={250}>
          <Rect width={300} height={140} fill="#8b5a2b" cornerRadius={10} />

          <Text
            text="TABLE"
            width={300}
            height={140}
            align="center"
            verticalAlign="middle"
            fill="white"
            fontSize={24}
          />
        </Group>

        {/* Laptop */}
        <Group x={450} y={275}>
          <Rect width={100} height={65} fill="#222" cornerRadius={5} />

          <Rect x={10} y={10} width={80} height={45} fill="#4a90e2" />

          <Rect
            x={-10}
            y={65}
            width={120}
            height={10}
            fill="#777"
            cornerRadius={3}
          />
        </Group>

        {/* Chair 1 */}
        <Group x={280} y={280}>
          <Circle radius={35} fill="#3b82f6" />

          <Text text="C" x={-10} y={-12} fontSize={24} fill="white" />
        </Group>

        {/* Chair 2 */}
        <Group x={670} y={280}>
          <Circle radius={35} fill="#3b82f6" />

          <Text text="C" x={-10} y={-12} fontSize={24} fill="white" />
        </Group>

        {/* Character */}
        <Group x={750} y={450}>
          <Circle radius={25} fill="#f59e0b" />

          <Circle x={-8} y={-5} radius={4} fill="black" />

          <Circle x={8} y={-5} radius={4} fill="black" />

          <Text text="Player" x={-30} y={35} fontSize={14} fill="#222" />
        </Group>
      </Layer>
    </Stage>
  );
}
