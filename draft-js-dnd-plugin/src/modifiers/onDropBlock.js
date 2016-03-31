import addBlock from './addBlock';
import removeBlock from './removeBlock';
import { Entity } from 'draft-js';

export default function onDropBlock() {
  return function onDropBlockInner(event) {
    const { selection, dataTransfer, getEditorState, updateEditorState } = event;

    const state = getEditorState();

    // Get data 'text' (anything else won't move the cursor) and expecting kind of data (text/key)
    const raw = dataTransfer.data.getData('text');
    const data = raw ? raw.split(':') : [];

    if (data.length !== 2) {
      return undefined;
    }

    // Existing block dropped
    if (data[0] === 'key') {
      const blockKey = data[1];

      // Get content, selection, block
      const block = state.getCurrentContent().getBlockForKey(blockKey);
      const editorStateAfterInsert = addBlock(state, selection, block.getType(), Entity.get(block.getEntityAt(0)).data);
      updateEditorState(removeBlock(editorStateAfterInsert, blockKey));
    }

    // New block dropped
    if (data[0] === 'type') {
      const blockType = data[1];

      // Get content, selection, block
      const editorStateAfterInsert = addBlock(state, selection, blockType, {});
      updateEditorState(editorStateAfterInsert);
    }

    return true;
  };
}
