let memories: string[] = [];

export function addMemory(memory: string) {
  memories.push(memory);
}

export function getMemories() {
  return memories;
}

export function clearMemories() {
  memories = [];
}

export function deleteMemory(index: number) {
  memories.splice(index, 1);
}