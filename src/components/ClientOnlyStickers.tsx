import { ClientOnly } from "@tanstack/react-router";
import DraggableStickers from "./DraggableStickers";

export default function ClientOnlyStickers() {
  return (
    <ClientOnly>
      <DraggableStickers />
    </ClientOnly>
  );
}
