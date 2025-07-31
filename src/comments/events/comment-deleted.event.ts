export class CommentDeletedEvent {
  id: number;

  fileId?: number; // Optional, if the comment has an associated media file
}
