let memories: string[] = [];

export function addMemory(memory: string) {
  memories.push(memory);
}

export function getMemories() {
  return memories;
}