import {
  EventSubscriber,
  EntitySubscriberInterface,
  RemoveEvent,
} from 'typeorm';
import Post from '../entities/post';
import PostImageUploadService from '../services/PostImageUploadService';

/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  listenTo() {
    return Post;
  }

  async afterRemove(event: RemoveEvent<Post>) {
    const postImageUploader = new PostImageUploadService(event.entityId);
    await postImageUploader.deleteAll();
  }
}
