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
    const { entity } = event;

    if (entity && entity.images.length > 0) {
      entity.id = event.entityId;
      const postImageUploader = new PostImageUploadService(entity);
      await postImageUploader.deleteAll();
    }
  }
}
