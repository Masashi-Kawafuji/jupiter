import {
  EventSubscriber,
  EntitySubscriberInterface,
  RemoveEvent,
} from 'typeorm';
import User from '../entities/user';
import AvatarUploadService from '../services/AvatarUploadService';

/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterRemove(event: RemoveEvent<User>) {
    const avatarUploader = new AvatarUploadService(event.entityId);
    await avatarUploader.delete();
  }
}
